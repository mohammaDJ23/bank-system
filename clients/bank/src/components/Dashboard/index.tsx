import { AxiosResponse } from 'axios';
import { FC, useEffect, useRef, useState } from 'react';
import { Box, CardContent, Typography, Slider, Input } from '@mui/material';
import { DateRange } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { BillsLastWeekApi, LastWeekUsersApi, PeriodAmountApi, TotalAmountApi, UserQuantitiesApi } from '../../apis';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import { debounce, getTime } from '../../lib';
import {
  BillDates,
  BillsLastWeekObj,
  LastWeekReport,
  LastWeekUsersObj,
  PeriodAmountFilter,
  TotalAmount,
  UserQuantities,
} from '../../store';
import Skeleton from '../Skeleton';
import Card from '../Card';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  AreaSeries,
  Title,
  Legend,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, Animation, EventTracker } from '@devexpress/dx-react-chart';
import { curveCatmullRom, area } from 'd3-shape';
import moment from 'moment';
import { notification } from 'antd';
import { scalePoint } from 'd3-scale';

const Root = (props: Legend.RootProps) => (
  <Legend.Root {...props} sx={{ display: 'flex', margin: 'auto', flexDirection: 'row' }} />
);
const Label = (props: Legend.LabelProps) => <Legend.Label {...props} sx={{ whiteSpace: 'nowrap' }} />;

const Area = (props: any) => (
  <AreaSeries.Path
    {...props}
    path={area()
      .x(({ arg }: any) => arg)
      .y1(({ val }: any) => val)
      .y0(({ startVal }: any) => startVal)
      .curve(curveCatmullRom)}
  />
);

function getDefaultSliderStep() {
  return 1 * 24 * 60 * 60 * 1000;
}

const Dashboard: FC = () => {
  const defaultSliderStep = getDefaultSliderStep();
  const [sliderStep, setSliderStep] = useState(defaultSliderStep);
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const { isAdmin } = useAuth();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isUserAdmin = isAdmin();
  const isTotalAmountProcessing = isInitialApiProcessing(TotalAmountApi);
  const isBillsLastWeekProcessing = isInitialApiProcessing(BillsLastWeekApi);
  const isPeriodAmountProcessing = isApiProcessing(PeriodAmountApi);
  const isUserQuantitiesProcessing = isInitialApiProcessing(UserQuantitiesApi);

  const periodAmountChangeRequest = useRef(
    debounce(500, (previousPeriodAmountFilter: PeriodAmountFilter, newPeriodAmountFilter: PeriodAmountFilter) => {
      request<TotalAmount, PeriodAmountFilter>(new PeriodAmountApi(newPeriodAmountFilter))
        .then(response => {
          const { totalAmount, quantities } = response.data;
          setSpecificDetails('totalAmount', new TotalAmount(totalAmount, quantities));
        })
        .catch(err => setSpecificDetails('periodAmountFilter', previousPeriodAmountFilter));
    })
  );

  useEffect(() => {
    if (isUserAdmin) {
      Promise.allSettled<[Promise<AxiosResponse<UserQuantities>>, Promise<AxiosResponse<LastWeekUsersObj[]>>]>([
        request(new UserQuantitiesApi().setInitialApi()),
        request(new LastWeekUsersApi().setInitialApi()),
      ]).then(([userQuantitiesResponse, lastWeekUsersResponse]) => {
        if (userQuantitiesResponse.status === 'fulfilled') {
          const { quantities, adminQuantities, userQuantities } = userQuantitiesResponse.value.data;
          setSpecificDetails('userQuantities', new UserQuantities(quantities, adminQuantities, userQuantities));
        }

        if (lastWeekUsersResponse.status === 'fulfilled')
          setSpecificDetails('lastWeekUsers', lastWeekUsersResponse.value.data);
      });
    }

    Promise.allSettled<[Promise<AxiosResponse<TotalAmount & BillDates>>, Promise<AxiosResponse<BillsLastWeekObj[]>>]>([
      request(new TotalAmountApi().setInitialApi()),
      request(new BillsLastWeekApi().setInitialApi()),
    ]).then(([totalAmountResponse, billsLastWeekResponse]) => {
      if (totalAmountResponse.status === 'fulfilled') {
        const { start, end, totalAmount, quantities } = totalAmountResponse.value.data;
        setSpecificDetails('totalAmount', new TotalAmount(totalAmount, quantities));
        setSpecificDetails('billDates', new BillDates(start, end));
        setSpecificDetails('periodAmountFilter', new PeriodAmountFilter(start, end));
      }

      if (billsLastWeekResponse.status === 'fulfilled')
        setSpecificDetails('billsLastWeek', billsLastWeekResponse.value.data);
    });
  }, []);

  function getNewDateValue(value: string) {
    let newDate = getTime(value);
    const startDate = specificDetails.billDates.start;
    const endDate = specificDetails.billDates.end;
    if (newDate < startDate) {
      notification.warning({
        message: 'Warning',
        description: `The minimum date is equal to ${moment(startDate).format('ll')}`,
        duration: 7,
      });
      newDate = startDate;
    } else if (newDate > endDate) {
      notification.warning({
        message: 'Warning',
        description: `The maximum date is equal to ${moment(endDate).format('ll')}`,
        duration: 7,
      });
      newDate = endDate;
    }
    return newDate;
  }

  function getChartData() {
    let chartData: LastWeekReport[] = [];

    for (let i = 0; i < specificDetails.billsLastWeek.length; i++)
      chartData[i] = new LastWeekReport({
        date: moment(specificDetails.billsLastWeek[i].date).format('l'),
        billCounts: specificDetails.billsLastWeek[i].count,
        billAmount: specificDetails.billsLastWeek[i].amount,
      });

    for (let i = 0; i < chartData.length && isUserAdmin; i++)
      lastWeekUsersLoop: for (let j = 0; j < specificDetails.lastWeekUsers.length; j++)
        if (moment(chartData[i].date).format('l') === moment(specificDetails.lastWeekUsers[j].date).format('l')) {
          chartData[i] = Object.assign<LastWeekReport, Partial<LastWeekReport>>(chartData[i], {
            userCounts: specificDetails.lastWeekUsers[i].count,
          });
          break lastWeekUsersLoop;
        }

    return chartData;
  }

  function changeStartDate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const previousPeriodAmountFilter = specificDetails.periodAmountFilter;
    const newPeriodAmountFilter = new PeriodAmountFilter(
      getNewDateValue(event.target.value),
      previousPeriodAmountFilter.end
    );
    setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    periodAmountChangeRequest.current(previousPeriodAmountFilter, newPeriodAmountFilter);
  }

  function changeSlider(evnet: Event, value: number | number[]) {
    let [start, end] = value as number[];
    const remiderOfEndDates = specificDetails.billDates.end - end;

    if (remiderOfEndDates < 1 * 24 * 60 * 60 * 1000) {
      end = specificDetails.billDates.end;
      setSliderStep(defaultSliderStep + remiderOfEndDates);
    } else setSliderStep(defaultSliderStep);

    const previousPeriodAmountFilter = specificDetails.periodAmountFilter;
    const newPeriodAmountFilter = new PeriodAmountFilter(getTime(start), getTime(end));
    setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    periodAmountChangeRequest.current(previousPeriodAmountFilter, newPeriodAmountFilter);
  }

  function changeEndDate(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const previousPeriodAmountFilter = specificDetails.periodAmountFilter;
    const newPeriodAmountFilter = new PeriodAmountFilter(
      previousPeriodAmountFilter.start,
      getNewDateValue(event.target.value)
    );
    setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
    periodAmountChangeRequest.current(previousPeriodAmountFilter, newPeriodAmountFilter);
  }

  return (
    <MainContainer>
      <Box component="div" display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="16px">
        {isBillsLastWeekProcessing ? (
          <Skeleton height="440px" width="100%" />
        ) : (
          <>
            {(() => {
              const chartData = getChartData();
              return (
                chartData.length > 0 && (
                  <Card>
                    <CardContent>
                      <Chart data={chartData} height={400}>
                        {/**@ts-ignore */}
                        <ArgumentScale factory={scalePoint} />
                        <ArgumentAxis showGrid />
                        <ValueAxis
                          showGrid
                          tickFormat={scale => tick => {
                            if (Number.isInteger(tick)) return Math.floor(Number(tick)).toString();
                            else return '';
                          }}
                        />
                        <AreaSeries
                          color="#20a0ff"
                          name="Bills"
                          valueField="billCounts"
                          argumentField="date"
                          seriesComponent={Area}
                        />
                        {isUserAdmin && (
                          <AreaSeries
                            color="#ff3d00"
                            name="Users"
                            valueField="userCounts"
                            argumentField="date"
                            seriesComponent={Area}
                          />
                        )}
                        <Animation />
                        <EventTracker />
                        <Tooltip />
                        <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
                        <Title text="The Previous Week Reports" />
                      </Chart>
                    </CardContent>
                  </Card>
                )
              );
            })()}
          </>
        )}

        {isUserAdmin &&
          (isUserQuantitiesProcessing ? (
            <Skeleton width="100%" height="152px" />
          ) : (
            specificDetails.userQuantities && (
              <Card>
                <CardContent>
                  <Box display="flex" gap="20px" flexDirection="column">
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                      <Typography whiteSpace="nowrap">Total Users: </Typography>
                      <Typography>{specificDetails.userQuantities.quantities}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                      <Typography whiteSpace="nowrap">Admins: </Typography>
                      <Typography>{specificDetails.userQuantities.adminQuantities}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px">
                      <Typography whiteSpace="nowrap">Users: </Typography>
                      <Typography>{specificDetails.userQuantities.userQuantities}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )
          ))}

        {isTotalAmountProcessing ? (
          <Skeleton width="100%" height="128px" />
        ) : (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="center" flexDirection="column" gap="20px">
                {specificDetails.periodAmountFilter.start > 0 && specificDetails.periodAmountFilter.end > 0 && (
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap="30px" position="relative">
                    <Box display="flex" alignItems="center" gap="5px">
                      <Typography fontSize="10px" whiteSpace="nowrap">
                        {moment(specificDetails.periodAmountFilter.start).format('ll')}
                      </Typography>
                      <DateRange fontSize="small" sx={{ color: grey[600] }} />
                    </Box>
                    <Input
                      disabled={isPeriodAmountProcessing}
                      type="date"
                      value={moment(specificDetails.periodAmountFilter.start).format('YYYY-MM-DD')}
                      onChange={changeStartDate}
                      sx={{
                        position: 'absolute',
                        top: '7px',
                        left: '-57px',
                        opacity: '0',
                      }}
                    />
                    <Slider
                      disabled={isPeriodAmountProcessing}
                      value={[specificDetails.periodAmountFilter.start, specificDetails.periodAmountFilter.end]}
                      step={sliderStep}
                      min={specificDetails.billDates.start}
                      max={specificDetails.billDates.end}
                      onChange={changeSlider}
                      valueLabelDisplay="off"
                    />
                    <Box display="flex" alignItems="center" gap="5px">
                      <Typography fontSize="10px" whiteSpace="nowrap">
                        {moment(specificDetails.periodAmountFilter.end).format('ll')}
                      </Typography>
                      <DateRange fontSize="small" sx={{ color: grey[600] }} />
                    </Box>
                    <Input
                      disabled={isPeriodAmountProcessing}
                      type="date"
                      value={moment(specificDetails.periodAmountFilter.end).format('YYYY-MM-DD')}
                      onChange={changeEndDate}
                      sx={{
                        position: 'absolute',
                        top: '7px',
                        right: '0px',
                        opacity: '0',
                        width: '20px',
                      }}
                    />
                  </Box>
                )}
                <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                  <Typography whiteSpace="nowrap">Total Amount: </Typography>
                  <Typography>{specificDetails.totalAmount.totalAmount}</Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                  <Typography whiteSpace="nowrap">Bill quantities: </Typography>
                  <Typography>{specificDetails.totalAmount.quantities}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </MainContainer>
  );
};

export default Dashboard;

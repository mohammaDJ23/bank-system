import { AxiosResponse } from 'axios';
import { FC, useEffect, useRef } from 'react';
import { Box, CardContent, Typography, Slider, Input } from '@mui/material';
import { DateRange } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { BillDatesApi, BillsLastWeekApi, PeriodAmountApi, TotalAmountApi } from '../../apis';
import { useAction, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import { debounce } from '../../lib';
import { BillDates, BillsLastWeekObj, PeriodAmountFilter, PeriodAmountObj, TotalAmountObj } from '../../store';
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

export class BillsPeriod {
  constructor(
    public start: number = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(),
    public end: number = new Date().getTime()
  ) {}
}

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

const Dashboard: FC = () => {
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const isTotalAmountProcessing = isInitialApiProcessing(TotalAmountApi);
  const isInitialPeriodAmountProcessing = isInitialApiProcessing(PeriodAmountApi);
  const isBillsLastWeekProcessing = isInitialApiProcessing(BillsLastWeekApi);
  const isBillDatesProcessing = isInitialApiProcessing(BillDatesApi);
  const isPeriodAmountProcessing = isApiProcessing(PeriodAmountApi);

  const periodAmountChangeRequest = useRef(
    debounce(500, (previousPeriodAmountFilter: PeriodAmountFilter, newPeriodAmountFilter: PeriodAmountFilter) => {
      request(new PeriodAmountApi(newPeriodAmountFilter))
        .then(response => setSpecificDetails('periodAmount', response.data))
        .catch(err => setSpecificDetails('periodAmountFilter', previousPeriodAmountFilter));
    })
  );

  useEffect(() => {
    Promise.allSettled<
      [
        Promise<AxiosResponse<TotalAmountObj>>,
        Promise<AxiosResponse<PeriodAmountObj>>,
        Promise<AxiosResponse<BillsLastWeekObj[]>>,
        Promise<AxiosResponse<BillDates>>
      ]
    >([
      request(new TotalAmountApi().setInitialApi()),
      request(new PeriodAmountApi(specificDetails.periodAmountFilter).setInitialApi()),
      request(new BillsLastWeekApi().setInitialApi()),
      request(new BillDatesApi().setInitialApi()),
    ]).then(([totalAmountResponse, periodAmountResponse, billsLastWeekResponse, billDatesResponse]) => {
      if (totalAmountResponse.status === 'fulfilled') setSpecificDetails('totalAmount', totalAmountResponse.value.data);

      if (periodAmountResponse.status === 'fulfilled')
        setSpecificDetails('periodAmount', periodAmountResponse.value.data);

      if (billsLastWeekResponse.status === 'fulfilled')
        setSpecificDetails('billsLastWeek', billsLastWeekResponse.value.data);

      if (billDatesResponse.status === 'fulfilled') {
        let { start, end } = billDatesResponse.value.data;
        setSpecificDetails('billDates', new BillDates(start, end));
      }
    });
  }, []);

  function getNewDateValue(value: string) {
    let newDate = new Date(value).getTime();
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

  return (
    <MainContainer>
      <Box component="div" display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="16px">
        {isBillsLastWeekProcessing ? (
          <Skeleton height="440px" width="100%" />
        ) : (
          <>
            {(() => {
              const billsLastWeek = specificDetails.billsLastWeek || [];
              const isBillsExist = billsLastWeek.length > 0;
              const data = billsLastWeek.map(item => ({
                ...item,
                date: new Date(item.date).getDay() + 1,
              }));

              return (
                isBillsExist && (
                  <Card>
                    <CardContent>
                      <Chart data={data} height={400}>
                        <ArgumentScale />
                        <ArgumentAxis
                          showGrid
                          tickFormat={scale => tick => {
                            if (Number.isInteger(tick) && data.findIndex(item => item.date === Number(tick)) > -1) {
                              return Math.floor(Number(tick)).toString();
                            } else return '';
                          }}
                        />
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
                          valueField="count"
                          argumentField="date"
                          seriesComponent={Area}
                        />
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

        {isTotalAmountProcessing ? (
          <Skeleton width="100%" height="64px" />
        ) : (
          specificDetails.totalAmount?.totalAmount && (
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                  <Typography whiteSpace="nowrap">Total Amount: </Typography>
                  <Typography>{specificDetails.totalAmount.totalAmount}</Typography>
                </Box>
              </CardContent>
            </Card>
          )
        )}

        {isInitialPeriodAmountProcessing || isBillDatesProcessing ? (
          <Skeleton width="100%" height="128px" />
        ) : (
          specificDetails.periodAmount &&
          specificDetails.periodAmountFilter.start &&
          specificDetails.periodAmountFilter.end && (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="center" flexDirection="column" gap="20px">
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px" position="relative">
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
                      onChange={event => {
                        const previousPeriodAmountFilter = specificDetails.periodAmountFilter;
                        const newPeriodAmountFilter = new PeriodAmountFilter(
                          getNewDateValue(event.target.value),
                          previousPeriodAmountFilter.end
                        );
                        setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
                        periodAmountChangeRequest.current(previousPeriodAmountFilter, newPeriodAmountFilter);
                      }}
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
                      step={1 * 24 * 60 * 60 * 1000}
                      min={specificDetails.billDates.start}
                      max={specificDetails.billDates.end}
                      onChange={(event, value) => {
                        const [start, end] = value as number[];
                        const previousPeriodAmountFilter = specificDetails.periodAmountFilter;
                        const newPeriodAmountFilter = new PeriodAmountFilter(
                          new Date(start).getTime(),
                          new Date(end).getTime()
                        );
                        setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
                        periodAmountChangeRequest.current(previousPeriodAmountFilter, newPeriodAmountFilter);
                      }}
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
                      onChange={event => {
                        const previousPeriodAmountFilter = specificDetails.periodAmountFilter;
                        const newPeriodAmountFilter = new PeriodAmountFilter(
                          previousPeriodAmountFilter.start,
                          getNewDateValue(event.target.value)
                        );
                        setSpecificDetails('periodAmountFilter', newPeriodAmountFilter);
                        periodAmountChangeRequest.current(previousPeriodAmountFilter, newPeriodAmountFilter);
                      }}
                      sx={{
                        position: 'absolute',
                        top: '7px',
                        right: '0px',
                        opacity: '0',
                        width: '20px',
                      }}
                    />
                  </Box>
                  {specificDetails.periodAmount.totalAmount && (
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                      <Typography whiteSpace="nowrap">Period Amount: </Typography>
                      <Typography>{specificDetails.periodAmount.totalAmount}</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Box>
    </MainContainer>
  );
};

export default Dashboard;

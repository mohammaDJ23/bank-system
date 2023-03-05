import { AxiosResponse } from 'axios';
import { FC, useEffect } from 'react';
import { Box, CardContent, Typography, Slider, Input } from '@mui/material';
import { DateRange } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { BillsLastWeekApi, BillsPeriodApi, PeriodAmountApi, TotalAmountApi } from '../../apis';
import { useAction, usePaginationList, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import { BillList, BillObj } from '../../lib';
import { BillsLastWeekObj, PeriodAmountFilter, PeriodAmountObj, TotalAmountObj } from '../../store';
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

export class BillsPeriod {
  constructor(
    public start: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    public end: string = new Date().toISOString()
  ) {}
}

const Root = (props: Legend.RootProps) => (
  <Legend.Root {...props} sx={{ display: 'flex', margin: 'auto', flexDirection: 'row' }} />
);
const Label = (props: Legend.LabelProps) => (
  <Legend.Label {...props} sx={{ whiteSpace: 'nowrap' }} />
);

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
  const { request, isInitialApiProcessing } = useRequest();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const listMaker = usePaginationList();
  const { setList } = listMaker(BillList);
  const isTotalAmountProcessing = isInitialApiProcessing(TotalAmountApi);
  const isPeriodAmountProcessing = isInitialApiProcessing(PeriodAmountApi);
  const isBillsPeriodProcessing = isInitialApiProcessing(BillsPeriodApi);
  const isBillsLastWeekProcessing = isInitialApiProcessing(BillsLastWeekApi);

  useEffect(() => {
    Promise.allSettled<
      [
        Promise<AxiosResponse<TotalAmountObj>>,
        Promise<AxiosResponse<PeriodAmountObj>>,
        Promise<AxiosResponse<[BillObj[], number]>>,
        Promise<AxiosResponse<BillsLastWeekObj[]>>
      ]
    >([
      request(new TotalAmountApi()),
      request(new PeriodAmountApi(specificDetails.periodAmountFilter)),
      request(new BillsPeriodApi(Object.assign({}, new BillsPeriod(), new BillList()))),
      request(new BillsLastWeekApi()),
    ]).then(
      ([totalAmountResponse, periodAmountResponse, billsPeriodResponse, billsLastWeekResponse]) => {
        if (totalAmountResponse.status === 'fulfilled')
          setSpecificDetails('totalAmount', totalAmountResponse.value.data);

        if (periodAmountResponse.status === 'fulfilled')
          setSpecificDetails('periodAmount', periodAmountResponse.value.data);

        if (billsPeriodResponse.status === 'fulfilled') {
          const [list, total] = billsPeriodResponse.value.data;
          const billList = new BillList();
          billList.total = total;
          billList.list[billList.page] = list;
          setList(billList);
        }

        if (billsLastWeekResponse.status === 'fulfilled')
          setSpecificDetails('billsLastWeek', billsLastWeekResponse.value.data);
      }
    );
  }, []);

  return (
    <MainContainer>
      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="16px"
      >
        {isBillsLastWeekProcessing ? (
          <Skeleton height="300px" width="100%" />
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
                      <Chart data={data}>
                        <ArgumentScale />
                        <ArgumentAxis
                          showGrid
                          tickFormat={scale => tick => {
                            if (
                              Number.isInteger(tick) &&
                              data.findIndex(item => item.date === Number(tick)) > -1
                            ) {
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
          <Skeleton width="100%" height="60px" />
        ) : (
          specificDetails.totalAmount && (
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

        {isPeriodAmountProcessing ? (
          <Skeleton width="100%" height="80px" />
        ) : (
          specificDetails.periodAmount && (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="center" flexDirection="column" gap="20px">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="20px"
                    position="relative"
                  >
                    <Box display="flex" alignItems="center" gap="5px">
                      <Typography fontSize="10px" whiteSpace="nowrap">
                        {moment(specificDetails.periodAmountFilter.start).format('ll')}
                      </Typography>
                      <DateRange fontSize="small" sx={{ color: grey[600] }} />
                    </Box>
                    <Input
                      type="date"
                      value={moment(specificDetails.periodAmountFilter.start).format('YYYY-MM-DD')}
                      onChange={event => {
                        setSpecificDetails(
                          'periodAmountFilter',
                          new PeriodAmountFilter(
                            new Date(event.target.value).toISOString(),
                            specificDetails.periodAmountFilter.end
                          )
                        );
                      }}
                      sx={{
                        position: 'absolute',
                        top: '7px',
                        left: '-57px',
                        opacity: '0',
                      }}
                    />
                    <Slider
                      value={[
                        new Date(specificDetails.periodAmountFilter.start).getTime(),
                        new Date(specificDetails.periodAmountFilter.end).getTime(),
                      ]}
                      min={new Date('2000-2-2').getTime()}
                      max={new Date('2023-3-4').getTime()}
                      onChange={(event, value) => {
                        const [start, end] = value as number[];
                        setSpecificDetails(
                          'periodAmountFilter',
                          new PeriodAmountFilter(
                            new Date(start).toISOString(),
                            new Date(end).toISOString()
                          )
                        );
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
                      type="date"
                      value={moment(specificDetails.periodAmountFilter.end).format('YYYY-MM-DD')}
                      onChange={event => {
                        setSpecificDetails(
                          'periodAmountFilter',
                          new PeriodAmountFilter(
                            specificDetails.periodAmountFilter.start,
                            new Date(event.target.value).toISOString()
                          )
                        );
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
                  <Box display="flex" alignItems="center" justifyContent="space-between" gap="20px">
                    <Typography whiteSpace="nowrap">Period Amount: </Typography>
                    <Typography>{specificDetails.periodAmount.totalAmount}</Typography>
                  </Box>
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

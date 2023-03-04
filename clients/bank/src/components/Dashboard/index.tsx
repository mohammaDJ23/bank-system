import { AxiosResponse } from 'axios';
import { FC, useEffect } from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import { BillsLastWeekApi, BillsPeriodApi, PeriodAmountApi, TotalAmountApi } from '../../apis';
import { useAction, usePaginationList, useRequest, useSelector } from '../../hooks';
import MainContainer from '../../layout/MainContainer';
import { BillList, BillObj } from '../../lib';
import { BillsLastWeekObj, PeriodAmountObj, TotalAmountObj } from '../../store';
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

export class PeriodAmount {
  constructor(
    public start: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    public end: string = new Date().toISOString()
  ) {}
}

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
      request(new PeriodAmountApi(new PeriodAmount())),
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
      </Box>
    </MainContainer>
  );
};

export default Dashboard;

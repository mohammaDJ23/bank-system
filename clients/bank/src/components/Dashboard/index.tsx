import { AxiosError, AxiosResponse } from 'axios';
import { FC, useEffect } from 'react';
import { BillsLastWeekApi, BillsPeriodApi, PeriodAmountApi, TotalAmountApi } from '../../apis';
import { useAction, usePaginationList, useRequest } from '../../hooks';
import { BillList, BillObj } from '../../lib';
import { BillsLastWeekObj, PeriodAmountObj, TotalAmountObj } from '../../store';

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

const Dashboard: FC = () => {
  const { request } = useRequest();
  const { setSpecificDetails } = useAction();
  const listMaker = usePaginationList();
  const { setList } = listMaker(BillList);

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

  return <div></div>;
};

export default Dashboard;

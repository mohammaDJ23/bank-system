import { FC, useEffect } from 'react';
import { BillsLastWeekApi, BillsPeriodApi, PeriodAmountApi, TotalAmountApi } from '../../apis';
import { useRequest } from '../../hooks';
import { BillList } from '../../lib';

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

const dashboardApis = [
  new TotalAmountApi(),
  new PeriodAmountApi(new PeriodAmount()),
  new BillsPeriodApi(Object.assign({}, new BillsPeriod(), new BillList())),
  new BillsLastWeekApi(),
];

const Dashboard: FC = () => {
  const { all } = useRequest();

  useEffect(() => {
    async function getRequests() {
      const [
        TotalAmountResponse,
        PeriodAmountResponse,
        billsPeriodResponse,
        billsLastWeekResponse,
      ] = await all(dashboardApis);
    }

    getRequests();
  }, []);

  return <div></div>;
};

export default Dashboard;

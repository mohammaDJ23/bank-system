import { FC } from 'react';

export class PeriodAmount {
  constructor(
    public start: string = new Date().toISOString(),
    public end: string = new Date().toISOString()
  ) {}
}

export class BillsPeriod {
  constructor(
    public start: string = new Date().toISOString(),
    public end: string = new Date().toISOString()
  ) {}
}

const Dashboard: FC = () => {
  return <div></div>;
};

export default Dashboard;

import { FC } from 'react';
import DashboardContent from '../components/Dashboard';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Dashboard: FC = () => {
  return (
    <ClearStateProvider>
      <DashboardContent />
    </ClearStateProvider>
  );
};

export default Dashboard;

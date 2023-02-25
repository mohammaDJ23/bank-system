import DashboardContent from '../components/Dashboard';
import ClearStateProvider from '../lib/providers/ClearStateProvider';

const Dashboard = () => {
  return (
    <ClearStateProvider>
      <DashboardContent />
    </ClearStateProvider>
  );
};

export default Dashboard;

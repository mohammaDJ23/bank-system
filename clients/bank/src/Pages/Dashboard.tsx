import DashboardContent from '../components/Dashboard';
import ClearStateProvider from '../lib/providers';

const Dashboard = () => {
  return (
    <ClearStateProvider>
      <DashboardContent />
    </ClearStateProvider>
  );
};

export default Dashboard;

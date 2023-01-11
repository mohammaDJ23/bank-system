import AdminRedirectionProvider from '../components/hoc/AdminRedirectionProvider';
import UpdateUserByAdminContent from '../components/UpdateUserByAdmin';

const UpdateUserByAdmin = () => {
  return (
    <AdminRedirectionProvider to="/bank/users">
      <UpdateUserByAdminContent />
    </AdminRedirectionProvider>
  );
};

export default UpdateUserByAdmin;

import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../../hooks';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="12px" mt="20px">
      <Typography>Not found the user</Typography>
      {isAdmin() ? (
        <Button onClick={() => navigate('/bank/users')} variant="contained" sx={{ textTransform: 'capitalize' }}>
          Back to the user list
        </Button>
      ) : (
        <Button onClick={() => navigate('/bank/dashboard')} variant="contained" sx={{ textTransform: 'capitalize' }}>
          Back to the dashboard
        </Button>
      )}
    </Box>
  );
};

export default NotFound;

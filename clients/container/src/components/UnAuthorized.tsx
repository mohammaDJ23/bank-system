import { Box, Typography, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { isUserAuthenticated, pathes } from '../lib';

const UnAuthorized = () => {
  const navigate = useNavigate();
  const isUserLoggedIn = isUserAuthenticated();

  return !isUserLoggedIn ? (
    <Box component="div" padding="30px" textAlign="center">
      <Typography mb="15px">You are not login to the app.</Typography>
      <Button
        onClick={() => {
          navigate(pathes.login);
        }}
        variant="contained"
        size="small"
        type="button"
        sx={{ textTransform: 'capitalize' }}
      >
        Navigate to the login page
      </Button>
    </Box>
  ) : (
    <Navigate to={pathes.dashboard} />
  );
};

export default UnAuthorized;

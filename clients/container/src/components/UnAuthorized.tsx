import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isUserAuthenticated, pathes } from '../lib';

const UnAuthorized = () => {
  const navigate = useNavigate();
  const isUserLoggedIn = isUserAuthenticated();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate(pathes.initial);
    }
  }, [isUserLoggedIn, navigate]);

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
  ) : null;
};

export default UnAuthorized;

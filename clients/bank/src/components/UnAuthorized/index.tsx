import { Box, Typography, Button } from '@mui/material';
import { useSelector } from '../../hooks';
import DefaultContainer from '../../layout/DefaultContainer';
import { isContainerApp, isUserAuthenticated, Pathes } from '../../lib';
import { Navigate } from 'react-router-dom';
import { FC } from 'react';

const UnAuthorized: FC = () => {
  const { history } = useSelector();
  const isUserLoggedIn = isUserAuthenticated();

  return !isUserLoggedIn ? (
    <DefaultContainer>
      <Box component="div" padding="30px" textAlign="center">
        <Typography mb="15px">You are not login to the app.</Typography>
        {history && (
          <Button
            onClick={() => {
              history.push(isContainerApp() ? Pathes.LOGIN : process.env.AUTH_APP + Pathes.LOGIN);
            }}
            variant="contained"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
          >
            Navigate to the login page
          </Button>
        )}
      </Box>
    </DefaultContainer>
  ) : (
    <Navigate to={Pathes.DASHBOARD} />
  );
};

export default UnAuthorized;

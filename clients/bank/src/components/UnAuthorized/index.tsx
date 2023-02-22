import { Box, Typography, Button } from '@mui/material';
import { useSelector } from '../../hooks';
import { isMicroFrontEnd, Pathes } from '../../lib';

const UnAuthorized = () => {
  const { history } = useSelector();

  return (
    <Box component="div" padding="30px" textAlign="center">
      <Typography mb="15px">You are not login to the app.</Typography>
      {history && (
        <Button
          onClick={() => {
            history.push(isMicroFrontEnd() ? Pathes.LOGIN : process.env.AUTH_APP + Pathes.LOGIN);
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
  );
};

export default UnAuthorized;

import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Box component="div" padding="30px" textAlign="center">
      <Typography mb="15px">You are not login to the app.</Typography>
      <Button
        onClick={() => {
          navigate('/auth/login');
        }}
        variant="contained"
        size="small"
        type="button"
        sx={{ textTransform: 'capitalize' }}
      >
        Navigate to the login page
      </Button>
    </Box>
  );
};

export default UnAuthorized;

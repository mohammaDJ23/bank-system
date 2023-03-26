import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="12px" mt="20px">
      <Typography>Not found the bill</Typography>
      <Button onClick={() => navigate('/bank/bills')} sx={{ textTransform: 'capitalize' }} variant="contained">
        Navigate To The Bill List
      </Button>
    </Box>
  );
};

export default NotFound;

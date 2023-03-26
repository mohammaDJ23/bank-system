import { Box, Typography, Button } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyList: FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="12px" mt="20px">
      <Typography>Empty List</Typography>
      <Button onClick={() => navigate('/bank/create-bill')} sx={{ textTransform: 'capitalize' }} variant="contained">
        Create A New Bill
      </Button>
    </Box>
  );
};

export default EmptyList;

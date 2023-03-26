import { Box, Typography } from '@mui/material';
import { Button } from 'element-react';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';

const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="12px" mt="20px">
      <Typography>Not found the bill</Typography>
      {/**@ts-ignore */}
      <Button onClick={() => navigate('/bank/create-bill')} type="primary">
        Create A New Bill
      </Button>
    </Box>
  );
};

export default NotFound;

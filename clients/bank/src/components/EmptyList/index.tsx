import { Box, Typography } from '@mui/material';
import { FC } from 'react';

const EmptyList: FC = () => {
  return (
    <Box textAlign="center" pt="30px">
      <Typography>Empty List</Typography>
    </Box>
  );
};

export default EmptyList;

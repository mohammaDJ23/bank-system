import { Box } from '@mui/material';
import CustomSkeleton from '../shared/Skeleton';
import { FC } from 'react';

const Skeleton: FC = () => {
  return (
    <Box width="100%" display="flex" alignItems="start" gap="12px" flexDirection="column">
      <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="15px" mb="15px">
        <Box maxWidth="400px" width="100%" height="14px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="40px" width="100%" height="14px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
      </Box>
      <Box maxWidth="150px" width="100%" height="12px">
        <CustomSkeleton width="100%" height="100%" />
      </Box>
      <Box maxWidth="300px" width="100%" height="12px">
        <CustomSkeleton width="100%" height="100%" />
      </Box>
      <Box maxWidth="130px" width="100%" height="12px">
        <CustomSkeleton width="100%" height="100%" />
      </Box>
      <Box maxWidth="140px" width="100%" height="12px">
        <CustomSkeleton width="100%" height="100%" />
      </Box>
    </Box>
  );
};

export default Skeleton;

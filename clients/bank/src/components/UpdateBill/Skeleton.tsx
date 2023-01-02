import { Box } from '@mui/material';
import { FC } from 'react';
import CustomSkeleton from '../Skeleton';

const Skeleton: FC = () => {
  return (
    <Box width="100%" display="flex" alignItems="start" gap="40px" flexDirection="column">
      <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
        <Box maxWidth="100px" width="100%" height="16px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
        <Box width="100%" height="30px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
      </Box>
      <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
        <Box maxWidth="100px" width="100%" height="16px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
        <Box width="100%" height="30px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
      </Box>
      <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
        <Box maxWidth="100px" width="100%" height="16px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
        <Box width="100%" height="30px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
      </Box>
      <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
        <Box maxWidth="100px" width="100%" height="16px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
        <Box width="100%" height="30px">
          <CustomSkeleton width="100%" height="100%" />
        </Box>
      </Box>
    </Box>
  );
};

export default Skeleton;

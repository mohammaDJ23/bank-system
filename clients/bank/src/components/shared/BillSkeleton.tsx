import { Box, List, ListItem } from '@mui/material';
import { FC } from 'react';
import CustomSkeleton from './Skeleton';

interface SkeletonImportation {
  take: number;
}

const Skeleton: FC<SkeletonImportation> = ({ take }) => {
  return (
    <List>
      {Array(take)
        .fill(null)
        .map((_, i) => (
          <ListItem
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              my: '25px',
              alignItems: 'start',
              px: '0',
            }}
          >
            <Box maxWidth="600px" width="100%" height="14px">
              <CustomSkeleton width="100%" height="100%" />
            </Box>
            <Box maxWidth="350px" width="100%" height="12px">
              <CustomSkeleton width="100%" height="100%" />
            </Box>
            <Box alignSelf="end" maxWidth="150px" width="100%" height="10px">
              <CustomSkeleton width="100%" height="100%" />
            </Box>
          </ListItem>
        ))}
    </List>
  );
};

export default Skeleton;

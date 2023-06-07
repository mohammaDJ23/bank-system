import { FC } from 'react';
import { Box, List, ListItem } from '@mui/material';
import CustomSkeleton from './Skeleton';

interface UserSkeletonImportation {
  take: number;
}

const UserSkeleton: FC<UserSkeletonImportation> = ({ take }) => {
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
            <Box maxWidth="400px" width="100%" height="14px">
              <CustomSkeleton width="100%" height="100%" />
            </Box>
            <Box maxWidth="150px" width="100%" height="12px">
              <CustomSkeleton width="100%" height="100%" />
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" gap="10px">
              <Box maxWidth="40px" width="100%" height="10px">
                <CustomSkeleton width="100%" height="100%" />
              </Box>
              <Box maxWidth="100px" width="100%" height="10px">
                <CustomSkeleton width="100%" height="100%" />
              </Box>
            </Box>
          </ListItem>
        ))}
    </List>
  );
};

export default UserSkeleton;

import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../../hooks';
import { Pathes } from '../../lib';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const { getTokenInfo, isAdmin } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="12px" mt="20px">
      <Typography>Not found the user</Typography>
      {isAdmin() ? (
        <Button
          onClick={() => navigate(Pathes.USERS)}
          sx={{ textTransform: 'capitalize' }}
          size="small"
          variant="contained"
        >
          Navigate To The User List
        </Button>
      ) : (
        isUserInfoExist && (
          <Button
            onClick={() => navigate(Pathes.USERS, { state: { previousUserId: userInfo.id } })}
            sx={{ textTransform: 'capitalize' }}
            variant="contained"
            size="small"
          >
            Navigate To The User Page
          </Button>
        )
      )}
    </Box>
  );
};

export default NotFound;

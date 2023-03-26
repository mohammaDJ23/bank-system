import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../../hooks';

const NotFound: FC = () => {
  const navigate = useNavigate();
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap="12px" mt="20px">
      <Typography>Not found the user</Typography>
      {isUserInfoExist && (
        <Button
          onClick={() => navigate(`/bank/users/${userInfo.id}`)}
          sx={{ textTransform: 'capitalize' }}
          variant="contained"
        >
          Navigate To User The Page
        </Button>
      )}
    </Box>
  );
};

export default NotFound;

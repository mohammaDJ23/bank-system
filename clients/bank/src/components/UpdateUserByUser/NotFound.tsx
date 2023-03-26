import { Box, Typography } from '@mui/material';
import { Button } from 'element-react';
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
        /**@ts-ignore */
        <Button onClick={() => navigate(`/bank/users/${userInfo.id}`)} type="primary">
          Navigate To The User Page
        </Button>
      )}
    </Box>
  );
};

export default NotFound;

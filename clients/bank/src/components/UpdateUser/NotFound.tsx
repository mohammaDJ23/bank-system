import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { useAuth } from '../../hooks';
import { getDynamicPath, Pathes } from '../../lib';

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
          onClick={() => navigate(getDynamicPath(Pathes.USER, { id: userInfo.id.toString() }))}
          sx={{ textTransform: 'capitalize' }}
          variant="contained"
          size="small"
        >
          Navigate To The User Page
        </Button>
      )}
    </Box>
  );
};

export default NotFound;

import { Box, ListItem, ListItemButton, ListItemText } from '@mui/material';
import moment from 'moment';
import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, usePaginationList } from '../../hooks';
import { getDynamicPath, getUserRoleColor, Pathes, UserObj } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';

interface UserCardImportion extends PropsWithChildren {
  user: UserObj;
  listInfo: ReturnType<ReturnType<typeof usePaginationList<UserObj>>['getFullInfo']>;
  index: number;
}

const UserCard: FC<UserCardImportion> = ({ user, index, listInfo }) => {
  const navigate = useNavigate();
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;

  return (
    <Card
      variant="outlined"
      sx={{
        my: '20px',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: isUserExist && user.id === userInfo.id && listInfo.total >= 2 ? '#F8F8F8' : '',
      }}
      onClick={() => {
        const path = user.deletedAt ? Pathes.DELETED_USER : Pathes.USER;
        navigate(getDynamicPath(path, { id: user.id.toString() }));
      }}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="10px">
            <Box component="div">
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', mb: '10px' }}
                secondaryTypographyProps={{ fontSize: '12px' }}
                sx={{ margin: '0' }}
                primary={`${user.firstName} ${user.lastName}`}
                secondary={user.phone}
              />
            </Box>
            <Box
              component="div"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="10px"
              width="100%"
              flexWrap="wrap"
            >
              <Box
                component="div"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="10px"
                flexWrap="wrap"
              >
                <ListItemText
                  sx={{
                    flex: 'unset',
                    width: '8px',
                    height: '8px',
                    backgroundColor: getUserRoleColor(user.role),
                    borderRadius: '50%',
                  }}
                  secondary={<Box component="span"></Box>}
                />
                <ListItemText
                  sx={{ flex: 'unset' }}
                  secondaryTypographyProps={{ fontSize: '10px' }}
                  secondary={user.role}
                />
              </Box>
              <ListItemText
                sx={{ flex: 'unset' }}
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  user.deletedAt
                    ? `${moment(user.deletedAt).format('lll')} was deleted`
                    : new Date(user.updatedAt) > new Date(user.createdAt)
                    ? `${moment(user.updatedAt).format('lll')} was updated`
                    : `${moment(user.createdAt).format('lll')}`
                }
              />
            </Box>
          </Box>
          <CountBadge take={listInfo.take} page={listInfo.page} index={index} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default UserCard;

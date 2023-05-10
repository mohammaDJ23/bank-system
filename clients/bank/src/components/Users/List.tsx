import { FC } from 'react';
import { List, ListItem, ListItemText, ListItemButton, Box, Card } from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Pathes, UserObj, getUserRoleColor } from '../../lib';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { useAuth, usePaginationList } from '../../hooks';

interface UserListImportation {
  listInstance: ReturnType<typeof usePaginationList<UserObj>>;
  onPageChange: (newPage: number) => void;
}

const UserList: FC<UserListImportation> = ({ listInstance, onPageChange }) => {
  const navigate = useNavigate();
  const listInfo = listInstance.getFullInfo();
  const { getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;

  return (
    <>
      <List>
        {listInfo.list.map((user, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              my: '20px',
              position: 'relative',
              overflow: 'visible',
              backgroundColor: isUserExist && user.id === userInfo.id && listInfo.list.length >= 2 ? '#F8F8F8' : '',
            }}
            onClick={() => navigate(Pathes.USER.replace(':id', user.id.toString()))}
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
                        new Date(user.updatedAt) > new Date(user.createdAt)
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
        ))}
      </List>

      <Pagination page={listInfo.page} count={listInfo.count} onPageChange={onPageChange} />
    </>
  );
};

export default UserList;

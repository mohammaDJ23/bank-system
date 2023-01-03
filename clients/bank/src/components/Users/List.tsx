import { FC } from 'react';
import { List, ListItem, ListItemText, ListItemButton, Box, Card } from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { UserObj } from '../../lib';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';

interface UserListImportation {
  list: UserObj[];
  count: number;
  page: number;
  take: number;
  onPageChange: (newPage: number) => void;
}

const UserList: FC<UserListImportation> = ({ list, take, count, page, onPageChange }) => {
  const navigate = useNavigate();

  return (
    <>
      <List>
        {list.map((user, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
            onClick={() => navigate(`/bank/users/${user.id}`)}
          >
            <ListItemButton>
              <ListItem disablePadding sx={{ my: '10px' }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width="100%"
                  gap="10px"
                >
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
                    <ListItemText
                      sx={{ flex: 'unset' }}
                      secondaryTypographyProps={{ fontSize: '10px' }}
                      secondary={user.role}
                    />
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
                <CountBadge take={take} page={page} index={index} />
              </ListItem>
            </ListItemButton>
          </Card>
        ))}
      </List>

      <Pagination page={page} count={count} onPageChange={onPageChange} />
    </>
  );
};

export default UserList;

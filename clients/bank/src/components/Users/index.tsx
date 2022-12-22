import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Card,
  Badge,
  styled,
} from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useList } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { UserList, UserObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from '../Skeleton';

const BadgeWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  top: '-32px',
  right: '-10px',
  '.css-1c32n2y-MuiBadge-root': {
    display: 'unset',
  },
  '.css-106c1u2-MuiBadge-badge': {
    display: 'unset',
    position: 'unset',
    padding: '2px 6px',
  },
}));

const UsersContent = () => {
  const navigate = useNavigate();
  const { list, take, isEmptyList } = useList<UserObj>(new UserList());
  const isListProcessing = false;

  function skeleton() {
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
                <Skeleton width="100%" height="100%" />
              </Box>
              <Box maxWidth="150px" width="100%" height="12px">
                <Skeleton width="100%" height="100%" />
              </Box>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="10px"
              >
                <Box maxWidth="40px" width="100%" height="10px">
                  <Skeleton width="100%" height="100%" />
                </Box>
                <Box maxWidth="100px" width="100%" height="10px">
                  <Skeleton width="100%" height="100%" />
                </Box>
              </Box>
            </ListItem>
          ))}
      </List>
    );
  }

  function billList() {
    return (
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
                <BadgeWrapper>
                  <Badge max={Infinity} badgeContent={index + 1} color="primary"></Badge>
                </BadgeWrapper>
              </ListItem>
            </ListItemButton>
          </Card>
        ))}
      </List>
    );
  }

  return (
    <ListContainer>
      {isListProcessing ? skeleton() : isEmptyList ? <EmptyList /> : billList()}
    </ListContainer>
  );
};

export default UsersContent;

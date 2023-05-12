import { FC, useEffect, useState, useRef, useCallback } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Card,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import { AddCircle, Close } from '@mui/icons-material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Pathes, UserObj, getUserRoleColor, UserListFilters, isoDate, getTime, UserRoles } from '../../lib';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { useAuth, useForm, usePaginationList, useRequest } from '../../hooks';
import { styled } from '@mui/material/styles';
import { UsersApi } from '../../apis';

interface AddCircleWrapperAttr {
  isActive: boolean;
}

const AddCircleWrapper = styled(Box)<AddCircleWrapperAttr>(({ theme, isActive }) => ({
  position: 'fixed',
  left: '20px',
  zIndex: '1',
  cursor: 'pointer',
  transition: 'bottom 0.3s, left 0.3s',
  [theme.breakpoints.up('lg')]: {
    bottom: isActive ? '-50px' : '20px',
  },
  [theme.breakpoints.down('lg')]: {
    bottom: isActive ? '-50px' : '20px',
  },
  [theme.breakpoints.down('md')]: {
    bottom: '-50px',
  },
}));

interface UserFiltersWrapperAttr {
  isActive: boolean;
}

const UserFiltersWrapper = styled(Box)<UserFiltersWrapperAttr>(({ theme, isActive }) => ({
  position: 'fixed',
  bottom: isActive ? '20px' : '-500px',
  right: '-20px',
  left: '20px',
  zIndex: '2',
  transition: 'bottom 0.3s, left 0.3s',
  width: 'calc(100% - 40px)',
  maxWidth: '330px',
  height: 'calc(100% - 40px - 64px)',
  maxHeight: '360px',
  overflowY: 'auto',
  boxShadow: '0px 5px 15px 0px rgba(0,0,0,0.2)',
  backgroundColor: 'white',
  borderRadius: '4px',
  padding: '8px 16px',
}));

const UserFiltersContent = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
}));

interface UserListImportation {
  listInstance: ReturnType<typeof usePaginationList<UserObj>>;
  onPageChange: (newPage: number) => void;
  onFilterSubmit: () => void;
}

const UserList: FC<UserListImportation> = ({ listInstance, onPageChange, onFilterSubmit }) => {
  const touchStartYPositionRef = useRef<number>(0);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const navigate = useNavigate();
  const userFiltersFromInstance = useForm(UserListFilters);
  const form = userFiltersFromInstance.getForm();
  const listInfo = listInstance.getFullInfo();
  const { getTokenInfo } = useAuth();
  const { isApiProcessing } = useRequest();
  const isUserApiProcessing = isApiProcessing(UsersApi);
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;

  useEffect(() => {
    function touchStartProcess(event: TouchEvent) {
      touchStartYPositionRef.current = event.changedTouches[0].clientY;
    }

    function touchMoveProcess(event: TouchEvent) {
      if (event.changedTouches[0].clientY < touchStartYPositionRef.current) {
        touchStartYPositionRef.current = event.changedTouches[0].clientY;
        setIsFilterOpened(true);
      }
    }

    function touchEndProcess(event: TouchEvent) {
      if (event.changedTouches[0].clientY > touchStartYPositionRef.current) {
        touchStartYPositionRef.current = 0;
        setIsFilterOpened(false);
      }
    }

    function keyupProcess(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsFilterOpened(false);
      }
    }

    document.addEventListener('keyup', keyupProcess, false);
    document.addEventListener('touchstart', touchStartProcess, false);
    document.addEventListener('touchmove', touchMoveProcess, false);
    document.addEventListener('touchend', touchEndProcess, false);
    return () => {
      document.removeEventListener('keyup', keyupProcess, false);
      document.removeEventListener('touchstart', touchStartProcess, false);
      document.removeEventListener('touchmove', touchMoveProcess, false);
      document.removeEventListener('touchend', touchEndProcess, false);
    };
  }, []);

  const formSubmition = useCallback(() => {
    userFiltersFromInstance.onSubmit(() => onFilterSubmit.call({}));
  }, []);

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

      <UserFiltersWrapper isActive={isFilterOpened}>
        <UserFiltersContent>
          <Box display="flex" alignItems="center" justifyContent="end" onClick={() => setIsFilterOpened(false)}>
            <Close />
          </Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection="column"
            gap="20px"
            onSubmit={event => {
              event.preventDefault();
              formSubmition();
            }}
          >
            <TextField
              label="Seach"
              variant="standard"
              type="text"
              fullWidth
              value={form.q}
              onChange={event => userFiltersFromInstance.onChange('q', event.target.value)}
              helperText={userFiltersFromInstance.getInputErrorMessage('q')}
              error={userFiltersFromInstance.isInputInValid('q')}
              name="q"
              placeholder="first name, last name, phone"
              disabled={isUserApiProcessing}
            />
            <Autocomplete
              multiple
              id="size-small-standard-multi"
              size="small"
              options={Object.values(UserRoles)}
              getOptionLabel={(option: (typeof form.roles)[number]) => option}
              onChange={(event, value) => userFiltersFromInstance.onChange('roles', value)}
              value={form.roles}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Roles"
                  variant="standard"
                  type="text"
                  error={userFiltersFromInstance.isInputInValid('roles')}
                  helperText={userFiltersFromInstance.getInputErrorMessage('roles')}
                  name="roles"
                />
              )}
              disabled={isUserApiProcessing}
            />

            <TextField
              label="From date"
              type="date"
              variant="standard"
              value={form.fromDate ? isoDate(form.fromDate) : ''}
              onChange={event => userFiltersFromInstance.onChange('fromDate', getTime(event.target.value))}
              helperText={userFiltersFromInstance.getInputErrorMessage('fromDate')}
              error={userFiltersFromInstance.isInputInValid('fromDate')}
              InputLabelProps={{ shrink: true }}
              name="fromDate"
              disabled={isUserApiProcessing}
            />
            <TextField
              label="To date"
              type="date"
              variant="standard"
              value={form.toDate ? isoDate(form.toDate) : ''}
              onChange={event => userFiltersFromInstance.onChange('toDate', getTime(event.target.value))}
              helperText={userFiltersFromInstance.getInputErrorMessage('toDate')}
              error={userFiltersFromInstance.isInputInValid('toDate')}
              InputLabelProps={{ shrink: true }}
              name="toDate"
              disabled={isUserApiProcessing}
            />
            <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
              <Button
                disabled={isUserApiProcessing || !userFiltersFromInstance.isFormValid()}
                variant="contained"
                size="small"
                type="submit"
                sx={{ textTransform: 'capitalize' }}
              >
                Filter
              </Button>
              <Button
                disabled={false}
                variant="outlined"
                size="small"
                type="button"
                sx={{ textTransform: 'capitalize' }}
                onClick={() => userFiltersFromInstance.resetForm()}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </UserFiltersContent>
      </UserFiltersWrapper>

      <AddCircleWrapper isActive={isFilterOpened} onClick={() => setIsFilterOpened(!isFilterOpened)}>
        <AddCircle fontSize="medium" color="primary" />
      </AddCircleWrapper>
    </>
  );
};

export default UserList;

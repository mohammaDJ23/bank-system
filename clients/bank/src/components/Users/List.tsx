import { FC, useCallback, useEffect } from 'react';
import {
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Card,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Pathes, UserObj, getUserRoleColor, UserListFilters, isoDate, getTime, UserRoles, UserList } from '../../lib';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { useAuth, useForm, usePaginationList, useRequest } from '../../hooks';
import { UsersApi, UsersApiConstructorType } from '../../apis';
import Filter from '../Filter';
import EmptyList from './EmptyList';
import Skeleton from './Skeleton';

const List: FC = () => {
  const navigate = useNavigate();
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const { getTokenInfo } = useAuth();
  const userListInstance = usePaginationList(UserList);
  const userListFiltersFormInstance = useForm(UserListFilters);
  const userListFiltersForm = userListFiltersFormInstance.getForm();
  const userListInfo = userListInstance.getFullInfo();
  const isInitialUsersApiProcessing = isInitialApiProcessing(UsersApi);
  const isUsersApiProcessing = isApiProcessing(UsersApi);
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;

  const getUsersList = useCallback(
    (options: Partial<UsersApiConstructorType> = {}) => {
      const apiData = Object.assign(
        { take: userListInfo.take, page: userListInfo.page, ...options },
        userListFiltersForm
      );
      const userApi = new UsersApi<UserObj>(apiData);
      userApi.setInitialApi(!!apiData.isInitialApi);

      request<[UserObj[], number], UsersApiConstructorType>(userApi).then(response => {
        const [list, total] = response.data;
        userListInstance.insertNewList({ total, list, page: apiData.page });
      });
    },
    [userListInfo, userListInstance, userListFiltersForm, request]
  );

  useEffect(() => {
    getUsersList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      userListInstance.onPageChange(newPage);

      if (userListInstance.isNewPageEqualToCurrentPage(newPage) || isUsersApiProcessing) return;

      if (!userListInstance.isNewPageExist(newPage)) getUsersList({ page: newPage });
    },
    [userListInstance, isUsersApiProcessing, getUsersList]
  );

  const userListFilterFormSubmition = useCallback(() => {
    userListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      userListInstance.onPageChange(newPage);
      getUsersList({ page: newPage });
    });
  }, [userListFiltersFormInstance, userListInstance, getUsersList]);

  return (
    <>
      {isInitialUsersApiProcessing || isUsersApiProcessing ? (
        <Skeleton take={userListInfo.take} />
      ) : userListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {userListInfo.list.map((user, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  my: '20px',
                  position: 'relative',
                  overflow: 'visible',
                  backgroundColor:
                    isUserExist && user.id === userInfo.id && userListInfo.list.length >= 2 ? '#F8F8F8' : '',
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
                    <CountBadge take={userListInfo.take} page={userListInfo.page} index={index} />
                  </ListItem>
                </ListItemButton>
              </Card>
            ))}
          </MuiList>
          <Pagination page={userListInfo.page} count={userListInfo.count} onPageChange={changePage} />
        </>
      )}

      {!isInitialUsersApiProcessing && (
        <Filter>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            display="flex"
            flexDirection="column"
            gap="20px"
            onSubmit={event => {
              event.preventDefault();
              userListFilterFormSubmition();
            }}
          >
            <TextField
              label="Seach"
              variant="standard"
              type="text"
              fullWidth
              value={userListFiltersForm.q}
              onChange={event => userListFiltersFormInstance.onChange('q', event.target.value)}
              helperText={userListFiltersFormInstance.getInputErrorMessage('q')}
              error={userListFiltersFormInstance.isInputInValid('q')}
              name="q"
              placeholder="first name, last name, phone"
              disabled={isUsersApiProcessing}
            />
            <Autocomplete
              multiple
              id="size-small-standard-multi"
              size="small"
              options={Object.values(UserRoles)}
              getOptionLabel={(option: (typeof userListFiltersForm.roles)[number]) => option}
              onChange={(event, value) => userListFiltersFormInstance.onChange('roles', value)}
              value={userListFiltersForm.roles}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  label="Roles"
                  variant="standard"
                  type="text"
                  error={userListFiltersFormInstance.isInputInValid('roles')}
                  helperText={userListFiltersFormInstance.getInputErrorMessage('roles')}
                  name="roles"
                />
              )}
              disabled={isUsersApiProcessing}
            />

            <TextField
              label="From date"
              type="date"
              variant="standard"
              value={userListFiltersForm.fromDate ? isoDate(userListFiltersForm.fromDate) : ''}
              onChange={event => userListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
              helperText={userListFiltersFormInstance.getInputErrorMessage('fromDate')}
              error={userListFiltersFormInstance.isInputInValid('fromDate')}
              InputLabelProps={{ shrink: true }}
              name="fromDate"
              disabled={isUsersApiProcessing}
            />
            <TextField
              label="To date"
              type="date"
              variant="standard"
              value={userListFiltersForm.toDate ? isoDate(userListFiltersForm.toDate) : ''}
              onChange={event => userListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
              helperText={userListFiltersFormInstance.getInputErrorMessage('toDate')}
              error={userListFiltersFormInstance.isInputInValid('toDate')}
              InputLabelProps={{ shrink: true }}
              name="toDate"
              disabled={isUsersApiProcessing}
            />
            <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
              <Button
                disabled={isUsersApiProcessing || !userListFiltersFormInstance.isFormValid()}
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
                onClick={() => userListFiltersFormInstance.resetForm()}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Filter>
      )}
    </>
  );
};

export default List;

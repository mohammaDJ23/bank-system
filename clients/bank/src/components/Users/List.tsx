import { FC, useCallback, useEffect } from 'react';
import { List as MuiList, Box, TextField, Button, Autocomplete } from '@mui/material';
import { UserObj, UserListFilters, isoDate, getTime, UserRoles, UserList } from '../../lib';
import Pagination from '../shared/Pagination';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { UsersApi, UsersApiConstructorType } from '../../apis';
import Filter from '../shared/Filter';
import EmptyList from './EmptyList';
import { ModalNames } from '../../store';
import UserSkeleton from '../shared/UsersSkeleton';
import UserCard from '../shared/UserCard';

const List: FC = () => {
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const userListInstance = usePaginationList(UserList);
  const userListFiltersFormInstance = useForm(UserListFilters);
  const userListFiltersForm = userListFiltersFormInstance.getForm();
  const userListInfo = userListInstance.getFullInfo();
  const isInitialUsersApiProcessing = isInitialApiProcessing(UsersApi);
  const isUsersApiProcessing = isApiProcessing(UsersApi);

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
        <UserSkeleton take={userListInfo.take} />
      ) : userListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {userListInfo.list.map((user, index) => (
              <UserCard key={index} index={index} user={user} listInfo={userListInfo} />
            ))}
          </MuiList>
          <Pagination page={userListInfo.page} count={userListInfo.count} onPageChange={changePage} />
        </>
      )}

      <Filter name={ModalNames.USER_FILTERS}>
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
            label="Search"
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
    </>
  );
};

export default List;

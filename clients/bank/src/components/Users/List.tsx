import { FC, useCallback } from 'react';
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
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Pathes, UserObj, getUserRoleColor, UserListFilters, isoDate, getTime, UserRoles } from '../../lib';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { useAuth, useForm, usePaginationList, useRequest } from '../../hooks';
import { UsersApi } from '../../apis';
import Filter from '../Filter';

interface UserListImportation {
  listInstance: ReturnType<typeof usePaginationList<UserObj>>;
  onPageChange: (newPage: number) => void;
  onFilterSubmit: () => void;
}

const UserList: FC<UserListImportation> = ({ listInstance, onPageChange, onFilterSubmit }) => {
  const navigate = useNavigate();
  const userFiltersFormInstance = useForm(UserListFilters);
  const form = userFiltersFormInstance.getForm();
  const listInfo = listInstance.getFullInfo();
  const { getTokenInfo } = useAuth();
  const { isApiProcessing } = useRequest();
  const isUserApiProcessing = isApiProcessing(UsersApi);
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;

  const formSubmition = useCallback(() => {
    userFiltersFormInstance.onSubmit(() => onFilterSubmit.call({}));
  }, [userFiltersFormInstance, onFilterSubmit]);

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
            formSubmition();
          }}
        >
          <TextField
            label="Seach"
            variant="standard"
            type="text"
            fullWidth
            value={form.q}
            onChange={event => userFiltersFormInstance.onChange('q', event.target.value)}
            helperText={userFiltersFormInstance.getInputErrorMessage('q')}
            error={userFiltersFormInstance.isInputInValid('q')}
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
            onChange={(event, value) => userFiltersFormInstance.onChange('roles', value)}
            value={form.roles}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Roles"
                variant="standard"
                type="text"
                error={userFiltersFormInstance.isInputInValid('roles')}
                helperText={userFiltersFormInstance.getInputErrorMessage('roles')}
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
            onChange={event => userFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={userFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={userFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isUserApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={form.toDate ? isoDate(form.toDate) : ''}
            onChange={event => userFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={userFiltersFormInstance.getInputErrorMessage('toDate')}
            error={userFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isUserApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isUserApiProcessing || !userFiltersFormInstance.isFormValid()}
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
              onClick={() => userFiltersFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Filter>
    </>
  );
};

export default UserList;

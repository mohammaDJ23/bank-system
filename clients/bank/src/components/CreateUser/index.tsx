import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel, FormHelperText } from '@mui/material';
import { notification } from 'antd';
import { CreateUser } from '../../lib';
import { useAuth, useForm, useRequest, useFocus } from '../../hooks';
import { CreateUserApi } from '../../apis';
import { FC, useCallback, useEffect } from 'react';

const CreateUserContent: FC = () => {
  const { getUserRoles } = useAuth();
  const { getForm, onChange, resetForm, onSubmit, isFormValid, getInputErrorMessage, isInputInValid } =
    useForm(CreateUser);
  const { isApiProcessing, request } = useRequest();
  const { focus } = useFocus();
  const isCreateUserApiProcessing = isApiProcessing(CreateUserApi);
  const form = getForm();

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<CreateUser, CreateUser>(new CreateUserApi(form)).then(response => {
        resetForm();
        notification.success({
          message: 'Success',
          description: 'Your have created a new user successfully.',
        });
      });
    });
  }, [form, resetForm, onSubmit, request]);

  useEffect(() => {
    focus('firstName');
  }, []);

  return (
    <FormContainer>
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
          label="First Name"
          variant="standard"
          type="text"
          value={form.firstName}
          onChange={event => onChange('firstName', event.target.value)}
          helperText={getInputErrorMessage('firstName')}
          error={isInputInValid('firstName')}
          disabled={isCreateUserApiProcessing}
          name="firstName"
        />
        <TextField
          label="Last Name"
          variant="standard"
          type="text"
          value={form.lastName}
          onChange={event => onChange('lastName', event.target.value)}
          helperText={getInputErrorMessage('lastName')}
          error={isInputInValid('lastName')}
          disabled={isCreateUserApiProcessing}
        />
        <TextField
          label="Email"
          type="email"
          variant="standard"
          value={form.email}
          onChange={event => onChange('email', event.target.value)}
          helperText={getInputErrorMessage('email')}
          error={isInputInValid('email')}
          disabled={isCreateUserApiProcessing}
        />
        <TextField
          label="Password"
          type="password"
          variant="standard"
          value={form.password}
          onChange={event => onChange('password', event.target.value)}
          helperText={getInputErrorMessage('password')}
          error={isInputInValid('password')}
          disabled={isCreateUserApiProcessing}
        />
        <TextField
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={event => onChange('phone', event.target.value)}
          helperText={getInputErrorMessage('phone')}
          error={isInputInValid('phone')}
          disabled={isCreateUserApiProcessing}
        />
        <FormControl variant="standard">
          <InputLabel id="role">Role</InputLabel>
          <Select
            disabled={isCreateUserApiProcessing}
            labelId="role"
            id="role"
            value={form.role}
            onChange={event => onChange('role', event.target.value)}
            label="Role"
            error={isInputInValid('role')}
          >
            {getUserRoles().map(el => (
              <MenuItem key={el.value} value={el.value}>
                {el.label}
              </MenuItem>
            ))}
          </Select>
          {isInputInValid('role') && <FormHelperText>{getInputErrorMessage('role')}</FormHelperText>}
        </FormControl>
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isCreateUserApiProcessing || !isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Create
          </Button>
          <Button
            disabled={isCreateUserApiProcessing}
            variant="outlined"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => resetForm()}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default CreateUserContent;

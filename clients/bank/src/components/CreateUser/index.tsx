import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { notification } from 'antd';
import { CreateUser } from '../../lib';
import { useAuth, useForm, useRequest } from '../../hooks';
import { CreateUserApi } from '../../apis';
import { FC, useCallback } from 'react';

const CreateUserContent: FC = () => {
  const { getUserRoles } = useAuth();
  const formMaker = useForm();
  const { getForm, onChange, resetForm, onSubmit } = formMaker(CreateUser);
  const { isApiProcessing, request } = useRequest();
  const isLoading = isApiProcessing(CreateUserApi);
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

  return (
    <FormContainer>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap="20px"
        onSubmit={formSubmition}
      >
        <TextField
          label="First Name"
          variant="standard"
          type="text"
          value={form.firstName}
          onChange={event => onChange('firstName', event.target.value)}
          helperText=""
          error={false}
          disabled={isLoading}
        />
        <TextField
          label="Last Name"
          variant="standard"
          type="text"
          value={form.lastName}
          onChange={event => onChange('lastName', event.target.value)}
          helperText=""
          error={false}
          disabled={isLoading}
        />
        <TextField
          label="Email"
          type="email"
          variant="standard"
          value={form.email}
          onChange={event => onChange('email', event.target.value)}
          helperText=""
          error={false}
          disabled={isLoading}
        />
        <TextField
          label="Password"
          type="password"
          variant="standard"
          value={form.password}
          onChange={event => onChange('password', event.target.value)}
          helperText=""
          error={false}
          disabled={isLoading}
        />
        <TextField
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={event => onChange('phone', event.target.value)}
          helperText=""
          error={false}
          disabled={isLoading}
        />
        <FormControl variant="standard">
          <InputLabel id="role">Role</InputLabel>
          <Select
            labelId="role"
            id="role"
            value={form.role}
            onChange={event => onChange('role', event.target.value)}
            label="Role"
            error={false}
          >
            {getUserRoles().map(el => (
              <MenuItem value={el.value}>{el.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isLoading}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Create
          </Button>
          <Button
            disabled={isLoading}
            variant="outlined"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default CreateUserContent;

import { FC } from 'react';
import { getUserRoles, UpdateUserByAdmin } from '../../lib';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useAction } from '../../hooks';
import {
  Box,
  TextField,
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';

interface FormImportation {
  onChange: (key: keyof UpdateUserByAdmin, value: any) => void;
  form: UpdateUserByAdmin;
  isLoading: boolean;
  onSubmitWithConfirmation: () => void;
  resetForm: () => void;
  isConfirmationModalActive: boolean;
  onSubmit: () => void;
  getInputErrorMessage: (key: keyof UpdateUserByAdmin) => string | undefined;
  isInputValid: (key: keyof UpdateUserByAdmin) => boolean;
  isFormValid: () => boolean;
}

const Form: FC<FormImportation> = ({
  form,
  isLoading,
  isConfirmationModalActive,
  onChange,
  onSubmitWithConfirmation,
  resetForm,
  onSubmit,
  getInputErrorMessage,
  isInputValid,
  isFormValid,
}) => {
  const { hideModal } = useAction();

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap="20px"
        onSubmit={event => {
          event.preventDefault();
          onSubmitWithConfirmation();
        }}
      >
        <TextField
          label="First Name"
          variant="standard"
          type="text"
          value={form.firstName}
          onChange={event => onChange('firstName', event.target.value)}
          helperText={getInputErrorMessage('firstName')}
          error={isInputValid('firstName')}
          disabled={isLoading}
        />
        <TextField
          label="Last Name"
          variant="standard"
          type="text"
          value={form.lastName}
          onChange={event => onChange('lastName', event.target.value)}
          helperText={getInputErrorMessage('lastName')}
          error={isInputValid('lastName')}
          disabled={isLoading}
        />
        <TextField
          label="Email"
          type="email"
          variant="standard"
          value={form.email}
          onChange={event => onChange('email', event.target.value)}
          helperText={getInputErrorMessage('email')}
          error={isInputValid('email')}
          disabled={isLoading}
        />
        <TextField
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={event => onChange('phone', event.target.value)}
          helperText={getInputErrorMessage('phone')}
          error={isInputValid('phone')}
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
            error={isInputValid('role')}
          >
            {getUserRoles().map(el => (
              <MenuItem key={el.value} value={el.value}>
                {el.label}
              </MenuItem>
            ))}
          </Select>
          {isInputValid('role') && <FormHelperText>{getInputErrorMessage('role')}</FormHelperText>}
        </FormControl>
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isLoading || !isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Update
          </Button>
          <Button
            disabled={isLoading}
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

      <Modal
        isLoading={isLoading}
        isActive={isConfirmationModalActive}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => onSubmit()}
      />
    </>
  );
};

export default Form;

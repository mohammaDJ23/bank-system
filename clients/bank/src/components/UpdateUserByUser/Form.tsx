import { FC } from 'react';
import { UpdateUserByUser } from '../../lib';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useAction } from '../../hooks';
import { Box, TextField, Button } from '@mui/material';

interface FormImportation {
  onChange: (key: keyof UpdateUserByUser, value: any) => void;
  form: UpdateUserByUser;
  isLoading: boolean;
  onSubmitWithConfirmation: () => void;
  resetForm: () => void;
  isConfirmationModalActive: boolean;
  onSubmit: () => void;
}

const Form: FC<FormImportation> = ({
  form,
  isLoading,
  isConfirmationModalActive,
  onChange,
  onSubmitWithConfirmation,
  resetForm,
  onSubmit,
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
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={event => onChange('phone', event.target.value)}
          helperText=""
          error={false}
          disabled={isLoading}
        />
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isLoading}
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

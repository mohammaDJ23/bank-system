import { FC, useCallback } from 'react';
import { Pathes, UpdateUserByUser } from '../../lib';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useAction, useForm, useRequest } from '../../hooks';
import { Box, TextField, Button } from '@mui/material';
import { UpdateUserByUserApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateUserByUser>>;
}

const Form: FC<FormImportation> = ({ formInstance }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { hideModal } = useAction();
  const { request, isApiProcessing } = useRequest();
  const isUpdateUserByUserApiProcessing = isApiProcessing(UpdateUserByUserApi);
  const form = formInstance.getForm();
  const { enqueueSnackbar } = useSnackbar();

  const formSubmition = useCallback(() => {
    formInstance.onSubmit(() => {
      request<UpdateUserByUser, UpdateUserByUser>(new UpdateUserByUserApi(form))
        .then(response => {
          const userId = params.id as string;
          hideModal(ModalNames.CONFIRMATION);
          formInstance.resetForm();
          enqueueSnackbar({ message: 'You have updated the user successfully.', variant: 'success' });
          navigate(Pathes.USER.replace(':id', userId));
        })
        .catch(err => hideModal(ModalNames.CONFIRMATION));
    });
  }, [form, formInstance, params, request, hideModal, navigate]);

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
          formInstance.confirmation();
        }}
      >
        <TextField
          label="First Name"
          variant="standard"
          type="text"
          value={form.firstName}
          onChange={event => formInstance.onChange('firstName', event.target.value)}
          helperText={formInstance.getInputErrorMessage('firstName')}
          error={formInstance.isInputInValid('firstName')}
          disabled={isUpdateUserByUserApiProcessing}
        />
        <TextField
          label="Last Name"
          variant="standard"
          type="text"
          value={form.lastName}
          onChange={event => formInstance.onChange('lastName', event.target.value)}
          helperText={formInstance.getInputErrorMessage('lastName')}
          error={formInstance.isInputInValid('lastName')}
          disabled={isUpdateUserByUserApiProcessing}
        />
        <TextField
          label="Email"
          type="email"
          variant="standard"
          value={form.email}
          onChange={event => formInstance.onChange('email', event.target.value)}
          helperText={formInstance.getInputErrorMessage('email')}
          error={formInstance.isInputInValid('email')}
          disabled={isUpdateUserByUserApiProcessing}
        />
        <TextField
          label="Phone"
          type="text"
          variant="standard"
          value={form.phone}
          onChange={event => formInstance.onChange('phone', event.target.value)}
          helperText={formInstance.getInputErrorMessage('phone')}
          error={formInstance.isInputInValid('phone')}
          disabled={isUpdateUserByUserApiProcessing}
        />
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isUpdateUserByUserApiProcessing || !formInstance.isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Update
          </Button>
          <Button
            disabled={isUpdateUserByUserApiProcessing}
            variant="outlined"
            size="small"
            type="button"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => formInstance.resetForm()}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Modal
        isLoading={isUpdateUserByUserApiProcessing}
        isActive={formInstance.isConfirmationActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;

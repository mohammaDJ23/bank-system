import { getDynamicPath, getTime, isoDate, Pathes, UpdateBill } from '../../lib';
import { FC, useCallback } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../shared/Modal';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import { UpdateBillApi } from '../../apis';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface FormImportation {
  formInstance: ReturnType<typeof useForm<UpdateBill>>;
}

const Form: FC<FormImportation> = ({ formInstance }) => {
  const params = useParams();
  const { hideModal } = useAction();
  const navigate = useNavigate();
  const { isApiProcessing, request } = useRequest();
  const isUpdateBillApiProcessing = isApiProcessing(UpdateBillApi);
  const form = formInstance.getForm();
  const { enqueueSnackbar } = useSnackbar();

  const formSubmition = useCallback(() => {
    formInstance.onSubmit(() => {
      request<UpdateBill, UpdateBill>(new UpdateBillApi(form))
        .then(response => {
          const billId = params.id as string;
          hideModal(ModalNames.CONFIRMATION);
          formInstance.resetForm();
          enqueueSnackbar({ message: 'You have updated the bill successfully.', variant: 'success' });
          navigate(getDynamicPath(Pathes.BILL, { id: billId }));
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
          label="Amount"
          variant="standard"
          type="number"
          value={form.amount}
          onChange={event => formInstance.onChange('amount', event.target.value)}
          helperText={formInstance.getInputErrorMessage('amount')}
          error={formInstance.isInputInValid('amount')}
          disabled={isUpdateBillApiProcessing}
        />
        <TextField
          label="Receiver"
          variant="standard"
          type="text"
          value={form.receiver}
          onChange={event => formInstance.onChange('receiver', event.target.value)}
          helperText={formInstance.getInputErrorMessage('receiver')}
          error={formInstance.isInputInValid('receiver')}
          disabled={isUpdateBillApiProcessing}
        />
        <TextField
          label="Date"
          type="date"
          variant="standard"
          value={isoDate(form.date)}
          onChange={event => formInstance.onChange('date', getTime(event.target.value))}
          helperText={formInstance.getInputErrorMessage('date')}
          error={formInstance.isInputInValid('date')}
          InputLabelProps={{ shrink: true }}
          disabled={isUpdateBillApiProcessing}
        />
        <TextField
          label="Description"
          type="text"
          rows="5"
          multiline
          variant="standard"
          value={form.description}
          onChange={event => formInstance.onChange('description', event.target.value)}
          helperText={formInstance.getInputErrorMessage('description')}
          error={formInstance.isInputInValid('description')}
          disabled={isUpdateBillApiProcessing}
        />
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isUpdateBillApiProcessing || !formInstance.isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Update
          </Button>
          <Button
            disabled={isUpdateBillApiProcessing}
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
        isLoading={isUpdateBillApiProcessing}
        isActive={formInstance.isConfirmationActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;

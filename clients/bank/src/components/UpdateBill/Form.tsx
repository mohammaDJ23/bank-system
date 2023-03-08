import { UpdateBill } from '../../lib';
import { FC } from 'react';
import { Box, TextField, Button } from '@mui/material';
import Modal from '../Modal';
import { useAction } from '../../hooks';
import { ModalNames } from '../../store';
import dateFormat from 'dateformat';

interface FormImportation {
  onChange: (key: keyof UpdateBill, value: any) => void;
  form: UpdateBill;
  isLoading: boolean;
  onSubmitWithConfirmation: () => void;
  formSubmition: () => void;
  resetForm: () => void;
  getInputErrorMessage: (key: keyof UpdateBill) => string | undefined;
  isInputInValid: (key: keyof UpdateBill) => boolean;
  isFormValid: () => boolean;
  isConfirmationActive: boolean;
}

const Form: FC<FormImportation> = ({
  onChange,
  onSubmitWithConfirmation,
  resetForm,
  formSubmition,
  getInputErrorMessage,
  isInputInValid,
  isFormValid,
  form,
  isLoading,
  isConfirmationActive,
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
          label="Amount"
          variant="standard"
          type="number"
          value={form.amount}
          onChange={event => onChange('amount', event.target.value)}
          helperText={getInputErrorMessage('amount')}
          error={isInputInValid('amount')}
          disabled={isLoading}
        />
        <TextField
          label="Receiver"
          variant="standard"
          type="text"
          value={form.receiver}
          onChange={event => onChange('receiver', event.target.value)}
          helperText={getInputErrorMessage('receiver')}
          error={isInputInValid('receiver')}
          disabled={isLoading}
        />
        <TextField
          label="Date"
          type="date"
          variant="standard"
          value={dateFormat(form.date, 'yyyy-mm-dd')}
          onChange={event => onChange('date', new Date(event.target.value).getTime())}
          helperText={getInputErrorMessage('date')}
          error={isInputInValid('date')}
          InputLabelProps={{ shrink: true }}
          disabled={isLoading}
        />
        <TextField
          label="Description"
          type="text"
          rows="5"
          multiline
          variant="standard"
          value={form.description}
          onChange={event => onChange('description', event.target.value)}
          helperText={getInputErrorMessage('description')}
          error={isInputInValid('description')}
          disabled={isLoading}
        />
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
        isActive={isConfirmationActive}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default Form;

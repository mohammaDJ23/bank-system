import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button } from '@mui/material';
import { notification } from 'antd';
import { CreateBill } from '../../lib';
import { useForm, useRequest } from '../../hooks';
import { FC, useCallback } from 'react';
import { CreateBillApi } from '../../apis';

const CreateBillContent: FC = () => {
  const formMaker = useForm();
  const {
    getForm,
    onChange,
    resetForm,
    onSubmit,
    getInputErrorMessage,
    isInputValid,
    isFormValid,
  } = formMaker(CreateBill);
  const { isApiProcessing, request } = useRequest();
  const isLoading = isApiProcessing(CreateBillApi);
  const form = getForm();

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      onChange('date', new Date(form.date));
      request<CreateBill, CreateBill>(new CreateBillApi(form)).then(response => {
        resetForm();
        notification.success({
          message: 'Success',
          description: 'Your bill was created successfully.',
        });
      });
    });
  }, [form, resetForm, onSubmit, request, onChange]);

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
          label="Amount"
          variant="standard"
          type="number"
          value={form.amount}
          onChange={event => onChange('amount', event.target.value)}
          helperText={getInputErrorMessage('amount')}
          error={isInputValid('amount')}
          disabled={isLoading}
        />
        <TextField
          label="Receiver"
          variant="standard"
          type="text"
          value={form.receiver}
          onChange={event => onChange('receiver', event.target.value)}
          helperText={getInputErrorMessage('receiver')}
          error={isInputValid('receiver')}
          disabled={isLoading}
        />
        <TextField
          label="Date"
          type="date"
          variant="standard"
          value={form.date}
          onChange={event => onChange('date', event.target.value)}
          helperText={getInputErrorMessage('date')}
          error={isInputValid('date')}
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
          error={isInputValid('description')}
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

export default CreateBillContent;

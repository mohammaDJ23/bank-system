import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button } from '@mui/material';
import { notification } from 'antd';
import { CreateBill, getTime, isoDate } from '../../lib';
import { useForm, useRequest, useFocus } from '../../hooks';
import { FC, useCallback, useEffect } from 'react';
import { CreateBillApi } from '../../apis';

const CreateBillContent: FC = () => {
  const { getForm, onChange, resetForm, onSubmit, getInputErrorMessage, isInputInValid, isFormValid } =
    useForm(CreateBill);
  const { isApiProcessing, request } = useRequest();
  const { focus } = useFocus();
  const isCreateBillApiProcessing = isApiProcessing(CreateBillApi);
  const form = getForm();

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<CreateBill, CreateBill>(new CreateBillApi(form)).then(response => {
        resetForm();
        notification.success({
          message: 'Success',
          description: 'Your bill was created successfully.',
        });
      });
    });
  }, [form, resetForm, onSubmit, request]);

  useEffect(() => {
    focus('amount');
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
          label="Amount"
          variant="standard"
          type="number"
          value={form.amount}
          onChange={event => onChange('amount', event.target.value)}
          helperText={getInputErrorMessage('amount')}
          error={isInputInValid('amount')}
          disabled={isCreateBillApiProcessing}
          name="amount"
        />
        <TextField
          label="Receiver"
          variant="standard"
          type="text"
          value={form.receiver}
          onChange={event => onChange('receiver', event.target.value)}
          helperText={getInputErrorMessage('receiver')}
          error={isInputInValid('receiver')}
          disabled={isCreateBillApiProcessing}
        />
        <TextField
          label="Date"
          type="date"
          variant="standard"
          value={isoDate(form.date)}
          onChange={event => onChange('date', getTime(event.target.value))}
          helperText={getInputErrorMessage('date')}
          error={isInputInValid('date')}
          InputLabelProps={{ shrink: true }}
          disabled={isCreateBillApiProcessing}
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
          disabled={isCreateBillApiProcessing}
        />
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button
            disabled={isCreateBillApiProcessing || !isFormValid()}
            variant="contained"
            size="small"
            type="submit"
            sx={{ textTransform: 'capitalize' }}
          >
            Create
          </Button>
          <Button
            disabled={isCreateBillApiProcessing}
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

export default CreateBillContent;

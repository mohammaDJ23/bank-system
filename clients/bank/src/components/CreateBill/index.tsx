import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button } from '@mui/material';
import { CreateBill, getTime, isoDate } from '../../lib';
import { useForm, useRequest, useFocus } from '../../hooks';
import { FC, useCallback, useEffect } from 'react';
import { CreateBillApi } from '../../apis';
import { useSnackbar } from 'notistack';
import Navigation from '../../layout/Navigation';

const CreateBillContent: FC = () => {
  const createBillFromInstance = useForm(CreateBill);
  const { isApiProcessing, request } = useRequest();
  const { focus } = useFocus();
  const isCreateBillApiProcessing = isApiProcessing(CreateBillApi);
  const form = createBillFromInstance.getForm();
  const { enqueueSnackbar } = useSnackbar();

  const formSubmition = useCallback(() => {
    createBillFromInstance.onSubmit(() => {
      request<CreateBill, CreateBill>(new CreateBillApi(form)).then(response => {
        createBillFromInstance.resetForm();
        enqueueSnackbar({ message: 'Your bill was created successfully.', variant: 'success' });
      });
    });
  }, [createBillFromInstance, form, request]);

  useEffect(() => {
    focus('amount');
  }, []);

  return (
    <Navigation>
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
            onChange={event => createBillFromInstance.onChange('amount', event.target.value)}
            helperText={createBillFromInstance.getInputErrorMessage('amount')}
            error={createBillFromInstance.isInputInValid('amount')}
            disabled={isCreateBillApiProcessing}
            name="amount"
          />
          <TextField
            label="Receiver"
            variant="standard"
            type="text"
            value={form.receiver}
            onChange={event => createBillFromInstance.onChange('receiver', event.target.value)}
            helperText={createBillFromInstance.getInputErrorMessage('receiver')}
            error={createBillFromInstance.isInputInValid('receiver')}
            disabled={isCreateBillApiProcessing}
          />
          <TextField
            label="Date"
            type="date"
            variant="standard"
            value={isoDate(form.date)}
            onChange={event => createBillFromInstance.onChange('date', getTime(event.target.value))}
            helperText={createBillFromInstance.getInputErrorMessage('date')}
            error={createBillFromInstance.isInputInValid('date')}
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
            onChange={event => createBillFromInstance.onChange('description', event.target.value)}
            helperText={createBillFromInstance.getInputErrorMessage('description')}
            error={createBillFromInstance.isInputInValid('description')}
            disabled={isCreateBillApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isCreateBillApiProcessing || !createBillFromInstance.isFormValid()}
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
              onClick={() => createBillFromInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </FormContainer>
    </Navigation>
  );
};

export default CreateBillContent;

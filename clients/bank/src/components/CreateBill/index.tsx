import FormContainer from '../../layout/FormContainer';
import { Box, TextField, Button } from '@mui/material';
import { notification } from 'antd';
import { CreateBill } from '../../lib';
import { useForm, useRequest } from '../../hooks';
import { FC, useCallback } from 'react';
import { CreateBillApi } from '../../apis';

const CreateBillContent: FC = () => {
  const formMaker = useForm();
  const { getForm, getRules, onChange, resetForm, setFormRef, onSubmit } = formMaker(CreateBill);
  const { isApiProcessing, request } = useRequest();
  const isLoading = isApiProcessing(CreateBillApi);
  const form = getForm();

  const formSubmition = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
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
    },
    [form, resetForm, onSubmit, request, onChange]
  );

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
          id="standard-basic"
          label="Amount"
          variant="standard"
          type="number"
          value={form.amount}
          onChange={event => onChange('amount', event.target.value)}
          helperText=""
          error={false}
        />
        <TextField
          id="standard-basic"
          label="Receiver"
          variant="standard"
          type="text"
          value={form.receiver}
          onChange={event => onChange('receiver', event.target.value)}
          helperText=""
          error={false}
        />
        <TextField
          id="standard-basic"
          label="Date"
          type="date"
          variant="standard"
          value={form.date}
          onChange={event => onChange('date', event.target.value)}
          helperText=""
          error={false}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          id="standard-basic"
          label="Description"
          type="text"
          rows="7"
          multiline
          variant="standard"
          value={form.description}
          onChange={event => onChange('description', event.target.value)}
          helperText=""
          error={false}
        />
        <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
          <Button variant="contained" size="small" sx={{ textTransform: 'capitalize' }}>
            Send
          </Button>
          <Button variant="outlined" size="small" sx={{ textTransform: 'capitalize' }}>
            Reset
          </Button>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default CreateBillContent;

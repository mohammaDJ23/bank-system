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
      {/* <Form ref={setFormRef} model={form} rules={getRules()} labelPosition="top" labelWidth="120">
    
        <Form.Item style={{ marginBottom: '32px' }} label="Amount" prop="amount">
          <Input
            type="number"
            onChange={value => onChange('amount', value)}
            value={form.amount}
            disabled={isLoading}
          ></Input>
        </Form.Item>

    
        <Form.Item style={{ marginBottom: '32px' }} label="Receiver" prop="receiver">
          <Input
            type="text"
            onChange={value => onChange('receiver', value)}
            value={form.receiver}
            disabled={isLoading}
          ></Input>
        </Form.Item>

    
        <Form.Item style={{ marginBottom: '32px' }} label="Date" prop="date">
          <Input
            type="date"
            onChange={value => onChange('date', value)}
            value={form.date}
            disabled={isLoading}
          ></Input>
        </Form.Item>

    
        <Form.Item style={{ marginBottom: '32px' }} label="Description" prop="description">
          <Input
            type="textarea"
            autosize={{ minRows: 5 }}
            onChange={value => onChange('description', value)}
            value={form.description}
            disabled={isLoading}
          ></Input>
        </Form.Item>

    
        <Form.Item style={{ marginBottom: '32px' }}>
      
          <Button type="primary" onClick={formSubmition} disabled={isLoading}>
            Create
          </Button>

      
          <Button onClick={() => resetForm()} disabled={isLoading}>
            Reset
          </Button>
        </Form.Item>
      </Form> */}

      <Box
        component="form"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap="20px"
      >
        <TextField
          id="standard-basic"
          label="Amount"
          variant="standard"
          type="number"
          value={''}
          helperText=""
          error={false}
        />
        <TextField
          id="standard-basic"
          label="Receiver"
          variant="standard"
          type="text"
          value={''}
          helperText=""
          error={false}
        />
        <TextField
          id="standard-basic"
          label="Date"
          type="date"
          variant="standard"
          value={''}
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
          value={''}
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

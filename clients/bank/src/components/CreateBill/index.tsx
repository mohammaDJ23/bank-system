import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { CreateBill } from '../../lib';
import { useForm, useRequest } from '../../hooks';
import { FC, useCallback } from 'react';
import { CreateBillApi } from '../../apis';

const CreateBillContent: FC = () => {
  const { formRef, rules, form, onChange, onSubmit, resetForm } = useForm(new CreateBill());
  const { isApiProcessing, request } = useRequest();
  const isLoading = isApiProcessing(CreateBillApi);

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<CreateBill, CreateBill>(new CreateBillApi(form)).then(response => {
        resetForm();
      });
    });
  }, [form, resetForm, onSubmit, request]);

  return (
    <FormContainer>
      {/**@ts-ignore */}
      <Form ref={formRef} model={form} rules={rules} labelPosition="top" labelWidth="120">
        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Amount" prop="amount">
          <Input
            type="number"
            onChange={value => onChange('amount', value)}
            value={form.amount}
            disabled={isLoading}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Receiver" prop="receiver">
          <Input
            type="text"
            onChange={value => onChange('receiver', value)}
            value={form.receiver}
            disabled={isLoading}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Date" prop="date">
          <Input
            type="date"
            onChange={value => onChange('date', value)}
            value={form.date}
            disabled={isLoading}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Description" prop="description">
          <Input
            type="textarea"
            autosize={{ minRows: 5 }}
            onChange={value => onChange('description', value)}
            value={form.description}
            disabled={isLoading}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }}>
          {/**@ts-ignore */}
          <Button type="primary" onClick={formSubmition} disabled={isLoading}>
            Create
          </Button>

          {/**@ts-ignore */}
          <Button onClick={() => resetForm(Apis.CREATE_BILL)} disabled={isLoading}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

export default CreateBillContent;

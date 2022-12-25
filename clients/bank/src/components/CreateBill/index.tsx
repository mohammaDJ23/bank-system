import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { CreateBill } from '../../lib';
import { useForm } from '../../hooks';
import { Apis } from '../../apis';

const CreateBillContent = () => {
  const { formRef, rules, form, onChange, onSubmit, resetForm, isFormProcessing } = useForm(
    new CreateBill()
  );
  const isLoading = isFormProcessing(Apis.CREATE_BILL);

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
          <Button type="primary" onClick={() => onSubmit(Apis.CREATE_BILL)} disabled={isLoading}>
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

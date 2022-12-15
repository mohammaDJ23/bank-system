import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { CreateBill } from '../../lib';
import { useForm } from '../../hooks';

const CreateBillContent = () => {
  const { formRef, rules, form, onChange, onSubmit, resetForm } = useForm(CreateBill);

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
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Receiver" prop="receiver">
          <Input
            type="text"
            onChange={value => onChange('receiver', value)}
            value={form.receiver}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Date" prop="date">
          <Input type="date" onChange={value => onChange('date', value)} value={form.date}></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }} label="Description" prop="description">
          <Input
            type="text"
            onChange={value => onChange('description', value)}
            value={form.description}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item style={{ marginBottom: '32px' }}>
          {/**@ts-ignore */}
          <Button type="primary" onClick={() => onSubmit()}>
            Create
          </Button>

          {/**@ts-ignore */}
          <Button onClick={() => resetForm()}>Reset</Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

export default CreateBillContent;

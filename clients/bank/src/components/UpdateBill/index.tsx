import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { UpdateBill } from '../../lib';
import { useAction, useForm } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';

const UpdateBillContent = () => {
  const {
    formRef,
    rules,
    form,
    onChange,
    onSubmitWithConfirmation,
    resetForm,
    isConfirmationModalActive,
  } = useForm(
    new UpdateBill({
      id: 0,
      amount: '',
      description: '',
      receiver: '',
      date: new Date(),
    })
  );
  const { hideModal } = useAction();

  return (
    <>
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
            <Input
              type="date"
              onChange={value => onChange('date', value)}
              value={form.date}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Description" prop="description">
            <Input
              type="textarea"
              autosize={{ minRows: 5 }}
              onChange={value => onChange('description', value)}
              value={form.description}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }}>
            {/**@ts-ignore */}
            <Button type="primary" onClick={() => onSubmitWithConfirmation()}>
              Update
            </Button>

            {/**@ts-ignore */}
            <Button onClick={() => resetForm()}>Reset</Button>
          </Form.Item>
        </Form>
      </FormContainer>
      <Modal
        isActive={isConfirmationModalActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => console.log('submit')}
      />
    </>
  );
};

export default UpdateBillContent;

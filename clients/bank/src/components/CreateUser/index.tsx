import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button, Select } from 'element-react';
import { CreateUser } from '../../lib';
import { useAction, useAuth, useForm } from '../../hooks';
import { ModalNames } from '../../store';
import Modal from '../Modal';

const CreateUserContent = () => {
  const { hideModal } = useAction();
  const { getUserRoles } = useAuth();
  const {
    formRef,
    rules,
    form,
    onChange,
    onSubmitWithConfirmation,
    isConfirmationModalActive,
    resetForm,
  } = useForm(new CreateUser());

  return (
    <>
      <FormContainer>
        {/**@ts-ignore */}
        <Form ref={formRef} model={form} rules={rules} labelPosition="top" labelWidth="120">
          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="First name" prop="firstName">
            <Input
              type="text"
              onChange={value => onChange('firstName', value)}
              value={form.firstName}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Last name" prop="lastName">
            <Input
              type="text"
              onChange={value => onChange('lastName', value)}
              value={form.lastName}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Email" prop="email">
            <Input
              type="email"
              onChange={value => onChange('email', value)}
              value={form.email}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Password" prop="password">
            <Input
              type="password"
              onChange={value => onChange('password', value)}
              value={form.password}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Phone" prop="phone">
            <Input onChange={value => onChange('phone', value)} value={form.phone}></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Role" prop="role">
            {/**@ts-ignore */}
            <Select
              placeholder="Select a role"
              value={form.role}
              clearable
              onChange={value => onChange('role', value)}
              style={{ width: '100%' }}
            >
              {getUserRoles().map(el => (
                <Select.Option key={el.value} label={el.label} value={el.value} />
              ))}
            </Select>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }}>
            {/**@ts-ignore */}
            <Button type="primary" onClick={() => onSubmitWithConfirmation()}>
              Create
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

export default CreateUserContent;

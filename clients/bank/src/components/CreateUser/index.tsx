import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button, Select } from 'element-react';
import { CreateUser } from '../../lib';
import { useAuth, useForm } from '../../hooks';
import { Apis } from '../../apis';
import { FC } from 'react';

const CreateUserContent: FC = () => {
  const { getUserRoles } = useAuth();
  const { formRef, rules, form, onChange, onSubmit, resetForm, isFormProcessing } = useForm(
    new CreateUser()
  );
  const isLoading = isFormProcessing(Apis.CREATE_USER);

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
              disabled={isLoading}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Last name" prop="lastName">
            <Input
              type="text"
              onChange={value => onChange('lastName', value)}
              value={form.lastName}
              disabled={isLoading}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Email" prop="email">
            <Input
              type="email"
              onChange={value => onChange('email', value)}
              value={form.email}
              disabled={isLoading}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Password" prop="password">
            <Input
              type="password"
              onChange={value => onChange('password', value)}
              value={form.password}
              disabled={isLoading}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Phone" prop="phone">
            <Input
              onChange={value => onChange('phone', value)}
              value={form.phone}
              disabled={isLoading}
            ></Input>
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
              disabled={isLoading}
            >
              {getUserRoles().map(el => (
                <Select.Option key={el.value} label={el.label} value={el.value} />
              ))}
            </Select>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }}>
            {/**@ts-ignore */}
            <Button
              type="primary"
              disabled={isLoading}
              loading={isLoading}
              onClick={() => onSubmit(Apis.CREATE_USER, { baseURL: process.env.USER_SERVICE })}
            >
              Create
            </Button>

            {/**@ts-ignore */}
            <Button
              onClick={() => resetForm(Apis.CREATE_USER)}
              disabled={isLoading}
              loading={isLoading}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </>
  );
};

export default CreateUserContent;

import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button, Select } from 'element-react';
import { notification } from 'antd';
import { CreateUser } from '../../lib';
import { useAuth, useForm, useRequest } from '../../hooks';
import { CreateUserApi } from '../../apis';
import { FC, useCallback } from 'react';

const CreateUserContent: FC = () => {
  const { getUserRoles } = useAuth();
  const formMaker = useForm();
  const { getForm, getRules, onChange, resetForm, setFormRef, onSubmit } = formMaker(CreateUser);
  const { isApiProcessing, request } = useRequest();
  const isLoading = isApiProcessing(CreateUserApi);
  const form = getForm();

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<CreateUser, CreateUser>(new CreateUserApi(form)).then(response => {
        resetForm();
        notification.success({
          message: 'Success',
          description: 'Your have created a new user successfully.',
        });
      });
    });
  }, [form, resetForm, onSubmit, request]);

  return (
    <>
      <FormContainer>
        {/**@ts-ignore */}
        <Form ref={setFormRef} model={form} rules={getRules()} labelPosition="top" labelWidth="120">
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
            <Button type="primary" disabled={isLoading} loading={isLoading} onClick={formSubmition}>
              Create
            </Button>

            {/**@ts-ignore */}
            <Button onClick={() => resetForm()} disabled={isLoading} loading={isLoading}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </FormContainer>
    </>
  );
};

export default CreateUserContent;

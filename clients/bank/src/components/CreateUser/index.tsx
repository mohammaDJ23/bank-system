import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button, Select } from 'element-react';
import { CreateUser, Roles } from '../../lib';
import { useForm } from '../../hooks';

const CreateUserContent = () => {
  const { formRef, rules, form, onChange, onSubmit, resetForm } = useForm(CreateUser);
  const roles = [
    { value: Roles.ADMIN, label: Roles.ADMIN },
    { value: Roles.USER, label: Roles.USER },
  ];

  return (
    <FormContainer>
      {/**@ts-ignore */}
      <Form ref={formRef} model={form} rules={rules} labelPosition="top" labelWidth="120">
        {/**@ts-ignore */}
        <Form.Item label="First name" prop="firstName">
          <Input
            type="text"
            onChange={value => onChange('firstName', value)}
            value={form.firstName}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Last name" prop="lastName">
          <Input
            type="text"
            onChange={value => onChange('lastName', value)}
            value={form.lastName}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Email" prop="email">
          <Input
            type="email"
            onChange={value => onChange('email', value)}
            value={form.email}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Password" prop="password">
          <Input
            type="password"
            onChange={value => onChange('password', value)}
            value={form.password}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Phone" prop="phone">
          <Input onChange={value => onChange('phone', value)} value={form.phone}></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Role" prop="role">
          {/**@ts-ignore */}
          <Select
            placeholder="Select a role"
            value={form.role}
            clearable
            onChange={value => onChange('role', value)}
            style={{ width: '100%' }}
          >
            {roles.map(el => (
              <Select.Option key={el.value} label={el.label} value={el.value} />
            ))}
          </Select>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item>
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

export default CreateUserContent;

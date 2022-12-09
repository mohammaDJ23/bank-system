import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button, Select } from 'element-react';
import { CreateUser, Rules, Roles } from '../../lib';
import { useRef, useState } from 'react';

interface ConstructFunction {
  new (...arg: any[]): {};
}

const CreateUserContent = () => {
  const formRef = useRef<Form | null>(null);
  const [createUser, setCreateUser] = useState(new CreateUser());
  const rules: Rules = createUser.getRules();
  const roles = [
    { value: Roles.ADMIN, label: Roles.ADMIN },
    { value: Roles.USER, label: Roles.USER },
  ];

  function copiedConstructor<T extends object>(instance: T) {
    const copy = new (instance.constructor as ConstructFunction)();
    return Object.assign(copy, instance);
  }

  function onChange(name: string, value: any) {
    setCreateUser(prevState => {
      return Object.assign(copiedConstructor(prevState), { [name]: value });
    });
  }

  function onSubmit() {
    if (!formRef.current) return;

    formRef.current.validate(valid => {
      if (valid) {
        console.log('submit!!');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  function resetForm() {
    if (!formRef.current) return;

    formRef.current.resetFields();

    setCreateUser(prevState => {
      return Object.assign(copiedConstructor(prevState), new CreateUser());
    });
  }

  return (
    <FormContainer>
      {/**@ts-ignore */}
      <Form ref={formRef} model={createUser} rules={rules} labelPosition="top" labelWidth="120">
        {/**@ts-ignore */}
        <Form.Item label="First name" prop="firstName">
          <Input
            type="text"
            onChange={value => onChange('firstName', value)}
            value={createUser.firstName}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Last name" prop="lastName">
          <Input
            type="text"
            onChange={value => onChange('lastName', value)}
            value={createUser.lastName}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Email" prop="email">
          <Input
            type="email"
            onChange={value => onChange('email', value)}
            value={createUser.email}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Password" prop="password">
          <Input
            type="password"
            onChange={value => onChange('password', value)}
            value={createUser.password}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Phone" prop="phone">
          <Input onChange={value => onChange('phone', value)} value={createUser.phone}></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Role" prop="role">
          {/**@ts-ignore */}
          <Select
            placeholder="Select a role"
            value={createUser.role}
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

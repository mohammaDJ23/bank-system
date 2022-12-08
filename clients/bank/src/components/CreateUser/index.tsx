import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { CreateUser } from '../../lib/forms';
import { useRef, useState } from 'react';

const CreateUserContent = () => {
  const formRef = useRef<Form | null>(null);
  const [createUser, setCreateUser] = useState(new CreateUser());
  const rules: Object = {};

  function onChange(name: string, value: any) {
    setCreateUser(prevState => {
      return Object.assign({}, prevState, { [name]: value });
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
      return Object.assign({}, new CreateUser());
    });
  }

  return (
    <FormContainer>
      {/**@ts-ignore */}
      <Form ref={formRef} model={createUser} rules={rules} labelPosition="top" labelWidth="120">
        {/**@ts-ignore */}
        <Form.Item label="First name" prop="firstName">
          <Input
            onChange={value => onChange('firstName', value)}
            value={createUser.firstName}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Last name" prop="lastName">
          <Input
            onChange={value => onChange('lastName', value)}
            value={createUser.lastName}
          ></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Email" prop="email">
          <Input onChange={value => onChange('email', value)} value={createUser.email}></Input>
        </Form.Item>

        {/**@ts-ignore */}
        <Form.Item label="Password" prop="password">
          <Input
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
          <Input onChange={value => onChange('role', value)} value={createUser.role}></Input>
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

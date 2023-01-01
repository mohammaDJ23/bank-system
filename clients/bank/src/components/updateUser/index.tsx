import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button, Select } from 'element-react';
import { UpdateUserByAdmin, UpdateUserByUser, UserObj } from '../../lib';
import { useAction, useForm, useRequest } from '../../hooks';
import { ModalNames } from '../../store';
import Modal from '../Modal';
import { useAuth } from '../../hooks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apis, Apis } from '../../apis';
import { Box } from '@mui/material';
import Skeleton from '../Skeleton';

const UpdateUserContent = () => {
  const params = useParams();
  const { hideModal } = useAction();
  const { isAdmin, getUserRoles } = useAuth();
  const { request, isApiProcessing, isInitialApiProcessing } = useRequest();
  const isUserAdmin = isAdmin();
  const currentForm = isUserAdmin ? new UpdateUserByAdmin() : new UpdateUserByUser();
  const currentApi = isUserAdmin ? Apis.UPDATE_USER_BY_ADMIN : Apis.UPDATE_USER_BY_USER;
  const {
    formRef,
    rules,
    form,
    onChange,
    onSubmitWithConfirmation,
    isConfirmationModalActive,
    resetForm,
    initializeForm,
    onSubmit,
  } = useForm(currentForm);
  const isUserProcessing = isInitialApiProcessing(Apis.USER);
  const isFormProcessing = isApiProcessing(currentApi);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request<UserObj, number>({
        apiName: Apis.USER,
        data: apis[Apis.USER](+userId),
        config: { baseURL: process.env.USER_SERVICE },
        afterRequest(response) {
          if (currentForm instanceof UpdateUserByAdmin) {
            currentForm.id = response.data.id;
            currentForm.firstName = response.data.firstName;
            currentForm.lastName = response.data.lastName;
            currentForm.email = response.data.email;
            currentForm.phone = response.data.phone;
            currentForm.role = response.data.role;
          } else if (currentForm instanceof UpdateUserByUser) {
            currentForm.id = response.data.id;
            currentForm.firstName = response.data.firstName;
            currentForm.lastName = response.data.lastName;
            currentForm.email = response.data.email;
            currentForm.phone = response.data.phone;
          }
          initializeForm(currentForm);
        },
      });
    }
  }, []);

  function skeleton() {
    return (
      <Box width="100%" display="flex" alignItems="start" gap="40px" flexDirection="column">
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
      </Box>
    );
  }

  function updateUserForm(form: UpdateUserByAdmin | UpdateUserByUser) {
    return (
      <>
        {/**@ts-ignore */}
        <Form ref={formRef} model={form} rules={rules} labelPosition="top" labelWidth="120">
          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="First name" prop="firstName">
            <Input
              type="text"
              onChange={value => onChange('firstName', value)}
              value={form.firstName}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Last name" prop="lastName">
            <Input
              type="text"
              onChange={value => onChange('lastName', value)}
              value={form.lastName}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Email" prop="email">
            <Input
              type="email"
              onChange={value => onChange('email', value)}
              value={form.email}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Phone" prop="phone">
            <Input
              onChange={value => onChange('phone', value)}
              value={form.phone}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {isUserAdmin && (
            /**@ts-ignore */
            <Form.Item style={{ marginBottom: '32px' }} label="Role" prop="role">
              {/**@ts-ignore */}
              <Select
                placeholder="Select a role"
                value={(form as UpdateUserByAdmin).role}
                clearable
                onChange={value => onChange('role', value)}
                style={{ width: '100%' }}
                disabled={isFormProcessing}
              >
                {getUserRoles().map(el => (
                  <Select.Option key={el.value} label={el.label} value={el.value} />
                ))}
              </Select>
            </Form.Item>
          )}

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }}>
            {/**@ts-ignore */}
            <Button
              loading={isFormProcessing}
              disabled={isFormProcessing}
              type="primary"
              onClick={() => onSubmitWithConfirmation()}
            >
              Update
            </Button>

            {/**@ts-ignore */}
            <Button
              loading={isFormProcessing}
              disabled={isFormProcessing}
              onClick={() => resetForm(currentApi)}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>

        <Modal
          isLoading={isFormProcessing}
          isActive={isConfirmationModalActive()}
          onCancel={() => hideModal(ModalNames.CONFIRMATION)}
          onConfirm={() => onSubmit(currentApi, { baseURL: process.env.USER_SERVICE })}
        />
      </>
    );
  }

  return <FormContainer>{isUserProcessing ? skeleton() : updateUserForm(form)}</FormContainer>;
};

export default UpdateUserContent;

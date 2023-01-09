import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByAdmin, UpdateUserByUser, UserObj } from '../../lib';
import { useAction, useForm, useRequest } from '../../hooks';
import { useAuth } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import { apis, Apis } from '../../apis';
import Skeleton from './Skeleton';

const UpdateUserContent: FC = () => {
  const params = useParams();
  const { hideModal } = useAction();
  const { isAdmin } = useAuth();
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

  return (
    <FormContainer>
      {isUserProcessing ? (
        <Skeleton />
      ) : (
        <Form
          isFormProcessing={isFormProcessing}
          isUserAdmin={isUserAdmin}
          currentApi={currentApi}
          form={form}
          formRef={formRef}
          rules={rules}
          onChange={onChange}
          onSubmit={onSubmit}
          isConfirmationModalActive={isConfirmationModalActive}
          resetForm={resetForm}
          onSubmitWithConfirmation={onSubmitWithConfirmation}
          hideModal={hideModal}
        />
      )}
    </FormContainer>
  );
};

export default UpdateUserContent;

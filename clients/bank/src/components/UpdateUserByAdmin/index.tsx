import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByAdmin, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector, useAuth } from '../../hooks';
import { useEffect, FC, useCallback } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UpdateUserByAdminApi, UserApi } from '../../apis';
import { Notification } from 'element-react';
import { ModalNames } from '../../store';

const UpdateUserByAdminContent: FC = () => {
  const params = useParams();
  const { hideModal } = useAction();
  const { history } = useSelector();
  const { isAdmin } = useAuth();
  const { request, isApiProcessing, isInitialApiProcessing } = useRequest();
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
  } = useForm(new UpdateUserByAdmin());
  const isUserProcessing = isInitialApiProcessing(UserApi);
  const isFormProcessing = isApiProcessing(UpdateUserByAdminApi);
  const userId = params.id;

  useEffect(() => {
    if (userId) {
      request<UserObj, number>(new UserApi(+userId)).then(response => {
        initializeForm(
          new UpdateUserByAdmin({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
            role: response.data.role,
          })
        );
      });
    }
  }, []);

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<UpdateUserByAdmin, UpdateUserByAdmin>(new UpdateUserByAdminApi(form)).then(
        response => {
          hideModal(ModalNames.CONFIRMATION);
          resetForm();
          Notification('You have updated the user successfully.', 'success');
          if (history) history.push(`/bank/users/${form.id}`);
        }
      );
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

  if (!isAdmin()) {
    return <Navigate to={`/bank/users/${userId}`} />;
  }

  return (
    <FormContainer>
      {isUserProcessing ? (
        <Skeleton />
      ) : (
        <Form
          isFormProcessing={isFormProcessing}
          form={form}
          formRef={formRef}
          rules={rules}
          onChange={onChange}
          onSubmit={formSubmition}
          isConfirmationModalActive={isConfirmationModalActive}
          resetForm={resetForm}
          onSubmitWithConfirmation={onSubmitWithConfirmation}
          hideModal={hideModal}
        />
      )}
    </FormContainer>
  );
};

export default UpdateUserByAdminContent;

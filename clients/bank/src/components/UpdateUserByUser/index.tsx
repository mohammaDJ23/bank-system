import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByUser, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UpdateUserByUserApi, UserApi } from '../../apis';
import { Notification } from 'element-react';
import { ModalNames } from '../../store';

const UpdateUserByUserContent: FC = () => {
  const params = useParams();
  const { hideModal } = useAction();
  const { history } = useSelector();
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
  } = useForm(new UpdateUserByUser());
  const isUserProcessing = isInitialApiProcessing(UserApi);
  const isFormProcessing = isApiProcessing(UpdateUserByUserApi);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request<UserObj, number>(new UserApi(+userId)).then(response => {
        initializeForm(
          new UpdateUserByUser({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
          })
        );
      });
    }
  }, []);

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<UpdateUserByUser, UpdateUserByUser>(new UpdateUserByUserApi(form)).then(response => {
        hideModal(ModalNames.CONFIRMATION);
        resetForm();
        Notification('You have updated the user successfully.', 'success');
        if (history) history.push(`/bank/users/${form.id}`);
      });
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

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

export default UpdateUserByUserContent;

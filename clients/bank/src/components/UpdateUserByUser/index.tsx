import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByUser, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UpdateUserByUserApi, UserApi } from '../../apis';
import { notification } from 'antd';
import { ModalNames } from '../../store';
import NotFound from './NotFound';

const UpdateUserByUserContent: FC = () => {
  const params = useParams();
  const { hideModal, setSpecificDetails } = useAction();
  const { history, specificDetails } = useSelector();
  const { request, isApiProcessing, isInitialApiProcessing } = useRequest();
  const formMaker = useForm();
  const {
    getForm,
    onChange,
    resetForm,
    onSubmit,
    initializeForm,
    confirmation,
    isConfirmationActive,
    getInputErrorMessage,
    isInputInValid,
    isFormValid,
  } = formMaker(UpdateUserByUser);
  const isUserProcessing = isInitialApiProcessing(UserApi);
  const isFormProcessing = isApiProcessing(UpdateUserByUserApi);
  const form = getForm();

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request<UserObj, number>(new UserApi(+userId).setInitialApi()).then(response => {
        setSpecificDetails('user', response.data);
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
        notification.success({
          message: 'Success',
          description: 'You have updated the user successfully.',
        });
        if (history) history.push(`/bank/users/${form.id}`);
      });
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

  return (
    <FormContainer>
      {isUserProcessing ? (
        <Skeleton />
      ) : specificDetails.user ? (
        <Form
          isLoading={isFormProcessing}
          form={form}
          onChange={onChange}
          onSubmit={formSubmition}
          isConfirmationModalActive={isConfirmationActive()}
          resetForm={resetForm}
          onSubmitWithConfirmation={confirmation}
          getInputErrorMessage={getInputErrorMessage}
          isInputInValid={isInputInValid}
          isFormValid={isFormValid}
        />
      ) : (
        <NotFound />
      )}
    </FormContainer>
  );
};

export default UpdateUserByUserContent;

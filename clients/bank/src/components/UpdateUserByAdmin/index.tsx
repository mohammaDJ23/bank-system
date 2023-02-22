import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByAdmin, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UpdateUserByAdminApi, UserApi } from '../../apis';
import { notification } from 'antd';
import { ModalNames } from '../../store';

const UpdateUserByAdminContent: FC = () => {
  const params = useParams();
  const { hideModal } = useAction();
  const { history } = useSelector();
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
    isInputValid,
    isFormValid,
  } = formMaker(UpdateUserByAdmin);
  const isUserProcessing = isInitialApiProcessing(UserApi);
  const isFormProcessing = isApiProcessing(UpdateUserByAdminApi);
  const form = getForm();
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
          notification.success({
            message: 'Success',
            description: 'You have updated the user successfully.',
          });
          if (history) history.push(`/bank/users/${form.id}`);
        }
      );
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

  return (
    <FormContainer>
      {isUserProcessing ? (
        <Skeleton />
      ) : (
        <Form
          isLoading={isFormProcessing}
          form={form}
          onChange={onChange}
          onSubmit={formSubmition}
          isConfirmationModalActive={isConfirmationActive()}
          resetForm={resetForm}
          onSubmitWithConfirmation={confirmation}
          getInputErrorMessage={getInputErrorMessage}
          isInputValid={isInputValid}
          isFormValid={isFormValid}
        />
      )}
    </FormContainer>
  );
};

export default UpdateUserByAdminContent;

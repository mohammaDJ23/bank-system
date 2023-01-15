import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByAdmin, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UpdateUserByAdminApi, UserApi } from '../../apis';
import { Notification } from 'element-react';
import { ModalNames } from '../../store';

const UpdateUserByAdminContent: FC = () => {
  const params = useParams();
  const { hideModal } = useAction();
  const { history } = useSelector();
  const { request, isApiProcessing, isInitialApiProcessing } = useRequest();
  const formMaker = useForm();
  const {
    getForm,
    getRules,
    onChange,
    resetForm,
    setFormRef,
    onSubmit,
    initializeForm,
    confirmation,
    isConfirmationActive,
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
          Notification('You have updated the user successfully.', 'success');
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
          isFormProcessing={isFormProcessing}
          form={form}
          formRef={setFormRef}
          rules={getRules()}
          onChange={onChange}
          onSubmit={formSubmition}
          isConfirmationModalActive={isConfirmationActive}
          resetForm={resetForm}
          onSubmitWithConfirmation={confirmation}
          hideModal={hideModal}
        />
      )}
    </FormContainer>
  );
};

export default UpdateUserByAdminContent;

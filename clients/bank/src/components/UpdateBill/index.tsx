import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { BillObj, getTime, UpdateBill } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { ModalNames } from '../../store';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { notification } from 'antd';
import Skeleton from './Skeleton';
import { BillApi, UpdateBillApi } from '../../apis';
import NotFound from './NotFound';

const UpdateBillContent: FC = () => {
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
  } = formMaker(UpdateBill);
  const isFormProcessing = isApiProcessing(UpdateBillApi);
  const isBillProcessing = isInitialApiProcessing(BillApi);
  const form = getForm();

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request<BillObj, number>(new BillApi(+billId).setInitialApi()).then(response => {
        setSpecificDetails('bill', response.data);
        initializeForm(
          new UpdateBill({
            id: response.data.id,
            amount: response.data.amount,
            receiver: response.data.receiver,
            description: response.data.description,
            date: getTime(response.data.date),
          })
        );
      });
    }
  }, []);

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<UpdateBill, UpdateBill>(new UpdateBillApi(form))
        .then(response => {
          hideModal(ModalNames.CONFIRMATION);
          resetForm();
          notification.success({
            message: 'Success',
            description: 'You have updated the bill successfully.',
          });
          if (history) history.push(`/bank/bills/${form.id}`);
        })
        .catch(err => hideModal(ModalNames.CONFIRMATION));
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

  return (
    <FormContainer>
      {isBillProcessing ? (
        <Skeleton />
      ) : specificDetails.bill ? (
        <Form
          onChange={onChange}
          onSubmitWithConfirmation={confirmation}
          resetForm={resetForm}
          formSubmition={formSubmition}
          isConfirmationActive={isConfirmationActive()}
          getInputErrorMessage={getInputErrorMessage}
          isInputInValid={isInputInValid}
          isFormValid={isFormValid}
          form={form}
          isLoading={isFormProcessing}
        />
      ) : (
        <NotFound />
      )}
    </FormContainer>
  );
};

export default UpdateBillContent;

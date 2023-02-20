import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { BillObj, UpdateBill } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { ModalNames } from '../../store';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { notification } from 'antd';
import Skeleton from './Skeleton';
import { BillApi, UpdateBillApi } from '../../apis';

const UpdateBillContent: FC = () => {
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
  } = formMaker(UpdateBill);
  const isFormProcessing = isApiProcessing(UpdateBillApi);
  const isBillProcessing = isInitialApiProcessing(BillApi);
  const form = getForm();

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request<BillObj, number>(new BillApi(+billId)).then(response => {
        initializeForm(
          new UpdateBill({
            id: response.data.id,
            amount: response.data.amount,
            receiver: response.data.receiver,
            description: response.data.description,
            date: new Date(response.data.date).toISOString(),
          })
        );
      });
    }
  }, []);

  const formSubmition = useCallback(() => {
    onSubmit(() => {
      request<UpdateBill, UpdateBill>(new UpdateBillApi(form)).then(response => {
        hideModal(ModalNames.CONFIRMATION);
        resetForm();
        notification.success({
          message: 'Success',
          description: 'You have updated the bill successfully.',
        });
        if (history) history.push(`/bank/bills/${form.id}`);
      });
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

  return (
    <FormContainer>
      {isBillProcessing ? (
        <Skeleton />
      ) : (
        <Form
          onChange={onChange}
          onSubmitWithConfirmation={confirmation}
          resetForm={resetForm}
          formSubmition={formSubmition}
          isConfirmationActive={isConfirmationActive()}
          form={form}
          isLoading={isFormProcessing}
        />
      )}
    </FormContainer>
  );
};

export default UpdateBillContent;

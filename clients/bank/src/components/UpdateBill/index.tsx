import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { BillObj, UpdateBill } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useEffect, FC, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Notification } from 'element-react';
import Skeleton from './Skeleton';
import { BillApi, UpdateBillApi } from '../../apis';

const UpdateBillContent: FC = () => {
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
    onSubmit,
    resetForm,
    isConfirmationModalActive,
    initializeForm,
  } = useForm(new UpdateBill());
  const isFormProcessing = isApiProcessing(UpdateBillApi);
  const isBillProcessing = isInitialApiProcessing(BillApi);

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
            date: response.data.date,
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
        Notification('You have updated the bill successfully.', 'success');
        if (history) history.push(`/bank/bills/${form.id}`);
      });
    });
  }, [form, history, resetForm, onSubmit, request, hideModal]);

  return (
    <>
      <FormContainer>
        {isBillProcessing ? (
          <Skeleton />
        ) : (
          <Form
            onChange={onChange}
            onSubmitWithConfirmation={onSubmitWithConfirmation}
            resetForm={resetForm}
            form={form}
            isFormProcessing={isFormProcessing}
            formRef={formRef}
            rules={rules}
          />
        )}
      </FormContainer>
      <Modal
        isLoading={isFormProcessing}
        isActive={isConfirmationModalActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={formSubmition}
      />
    </>
  );
};

export default UpdateBillContent;

import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { BillObj, UpdateBill } from '../../lib';
import { useAction, useForm, useRequest } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import { Apis, apis } from '../../apis';
import Skeleton from './Skeleton';

const UpdateBillContent: FC = () => {
  const params = useParams();
  const { hideModal } = useAction();
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
  const isFormProcessing = isApiProcessing(Apis.UPDATE_BILL);
  const isBillProcessing = isInitialApiProcessing(Apis.BILL);

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      request<BillObj, number>({
        apiName: Apis.BILL,
        data: apis[Apis.BILL](+billId),
        afterRequest(response) {
          initializeForm(
            new UpdateBill({
              id: response.data.id,
              amount: response.data.amount,
              receiver: response.data.receiver,
              description: response.data.description,
              date: response.data.date,
            })
          );
        },
      });
    }
  }, []);

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
        onConfirm={() => onSubmit(Apis.UPDATE_BILL)}
      />
    </>
  );
};

export default UpdateBillContent;

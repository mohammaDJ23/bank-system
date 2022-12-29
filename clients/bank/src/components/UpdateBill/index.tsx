import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { BillObj, UpdateBill } from '../../lib';
import { useAction, useForm, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Apis, apis, ResetApi } from '../../apis';

const UpdateBillContent = () => {
  const params = useParams();
  const { hideModal, asyncOp } = useAction();
  const { modals, loadings } = useSelector();

  const {
    formRef,
    rules,
    form,
    onChange,
    onSubmitWithConfirmation,
    resetForm,
    isConfirmationModalActive,
    initializeForm,
  } = useForm(new UpdateBill());

  useEffect(() => {
    const billId = params.id;
    if (billId) {
      asyncOp(async () => {
        const response = await ResetApi.req<BillObj>(apis[Apis.BILL](+billId));
        initializeForm(
          new UpdateBill({
            id: response.data.id,
            amount: response.data.amount,
            receiver: response.data.receiver,
            description: response.data.description,
            date: response.data.date,
          })
        );
      }, Apis.BILL);
    }
  }, [params, asyncOp, initializeForm]);

  return (
    <>
      <FormContainer>
        {/**@ts-ignore */}
        <Form ref={formRef} model={form} rules={rules} labelPosition="top" labelWidth="120">
          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Amount" prop="amount">
            <Input
              type="number"
              onChange={value => onChange('amount', value)}
              value={form.amount}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Receiver" prop="receiver">
            <Input
              type="text"
              onChange={value => onChange('receiver', value)}
              value={form.receiver}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Date" prop="date">
            <Input
              type="date"
              onChange={value => onChange('date', value)}
              value={form.date}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Description" prop="description">
            <Input
              type="textarea"
              autosize={{ minRows: 5 }}
              onChange={value => onChange('description', value)}
              value={form.description}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }}>
            {/**@ts-ignore */}
            <Button type="primary" onClick={() => onSubmitWithConfirmation()}>
              Update
            </Button>

            {/**@ts-ignore */}
            <Button onClick={() => resetForm()}>Reset</Button>
          </Form.Item>
        </Form>
      </FormContainer>
      <Modal
        isActive={isConfirmationModalActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => console.log('submit')}
      />
    </>
  );
};

export default UpdateBillContent;

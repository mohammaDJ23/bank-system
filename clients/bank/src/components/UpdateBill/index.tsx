import FormContainer from '../../layout/FormContainer';
import { Input, Form, Button } from 'element-react';
import { BillObj, UpdateBill } from '../../lib';
import { useAction, useForm, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Apis, apis, ResetApi } from '../../apis';
import { Box } from '@mui/material';
import Skeleton from '../Skeleton';

const UpdateBillContent = () => {
  const params = useParams();
  const { hideModal, asyncOp } = useAction();
  const { loadings } = useSelector();
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
  const isFormProcessing = loadings[Apis.UPDATE_BILL];
  const isBillProcessing = loadings[Apis.BILL] === undefined || loadings[Apis.BILL];

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

  function skeleton() {
    return (
      <Box width="100%" display="flex" alignItems="start" gap="40px" flexDirection="column">
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="start" gap="15px" flexDirection="column">
          <Box maxWidth="100px" width="100%" height="16px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box width="100%" height="30px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
      </Box>
    );
  }

  function updateBillForm() {
    return (
      <>
        {/**@ts-ignore */}
        <Form ref={formRef} model={form} rules={rules} labelPosition="top" labelWidth="120">
          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Amount" prop="amount">
            <Input
              type="number"
              onChange={value => onChange('amount', value)}
              value={form.amount}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Receiver" prop="receiver">
            <Input
              type="text"
              onChange={value => onChange('receiver', value)}
              value={form.receiver}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Date" prop="date">
            <Input
              type="date"
              onChange={value => onChange('date', value)}
              value={form.date}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }} label="Description" prop="description">
            <Input
              type="textarea"
              autosize={{ minRows: 5 }}
              onChange={value => onChange('description', value)}
              value={form.description}
              disabled={isFormProcessing}
            ></Input>
          </Form.Item>

          {/**@ts-ignore */}
          <Form.Item style={{ marginBottom: '32px' }}>
            {/**@ts-ignore */}
            <Button
              type="primary"
              onClick={() => onSubmitWithConfirmation()}
              disabled={isFormProcessing}
            >
              Update
            </Button>

            {/**@ts-ignore */}
            <Button onClick={() => resetForm()} disabled={isFormProcessing}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }

  return (
    <>
      <FormContainer>{isBillProcessing ? skeleton() : updateBillForm()}</FormContainer>
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

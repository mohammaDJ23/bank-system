import { Box, Typography, Button } from '@mui/material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { BillObj, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { RestoreBillApi } from '../../apis';

interface DetailsImporation {
  bill: BillObj;
}

const Details: FC<DetailsImporation> = ({ bill }) => {
  const navigate = useNavigate();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { isApiProcessing, request } = useRequest();

  const isRestoreBillApiProcessing = isApiProcessing(RestoreBillApi);

  const showRestoreBillModal = useCallback(() => {
    showModal(ModalNames.RESTORE_BILL);
  }, []);

  const hideRestoreBillModal = useCallback(() => {
    hideModal(ModalNames.RESTORE_BILL);
  }, []);

  const restoreBill = useCallback(() => {
    request(new RestoreBillApi(bill.id)).then(response => {
      navigate(Pathes.BILLS);
    });
  }, [bill]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="700" fontSize="14px">
            {bill.amount}
          </Typography>
        </Box>
        <Typography fontSize="12px" color="">
          receiver: {bill.receiver}
        </Typography>
        <Typography fontSize="12px" color="">
          description: {bill.description}
        </Typography>
        <Typography fontSize="12px" color="">
          received at: {moment(bill.date).format('LL')}
        </Typography>
        <Typography fontSize="12px" color="">
          created at: {moment(bill.createdAt).format('LLLL')}
        </Typography>
        <Typography fontSize="12px" color="">
          was deleted at: {moment(bill.deletedAt).format('LLLL')}
        </Typography>
        <Box mt="30px">
          <Button
            disabled={isRestoreBillApiProcessing}
            onClick={showRestoreBillModal}
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          >
            Restore the bill
          </Button>
        </Box>
      </Box>
      <Modal
        title="Restoring the bill"
        body="Are you sure to restore the bill?"
        isLoading={isRestoreBillApiProcessing}
        isActive={modals[ModalNames.RESTORE_BILL]}
        onCancel={hideRestoreBillModal}
        onConfirm={restoreBill}
      />
    </>
  );
};

export default Details;

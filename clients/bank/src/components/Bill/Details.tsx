import { Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import { Button } from 'element-react';
import Modal from '../Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { BillObj } from '../../lib';
import { ModalNames } from '../../store';
import { BillApi, DeleteBillApi } from '../../apis';

interface DetailsImporation {
  bill: BillObj;
}

const Details: FC<DetailsImporation> = ({ bill }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const params = useParams();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { isApiProcessing, request } = useRequest();
  const isDeleteBillProcessing = isApiProcessing(BillApi);
  const options = bill ? [{ label: 'Update', path: `/bank/update-bill/${bill.id}` }] : [];
  const billId = params.id;

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(
    (option: typeof options[number]) => {
      return function () {
        onMenuClose();
        navigate(option.path);
      };
    },
    [onMenuClose, navigate]
  );

  const onDeleteBill = useCallback(() => {
    showModal(ModalNames.CONFIRMATION);
  }, [showModal]);

  const deleteBill = useCallback(() => {
    if (billId) {
      request(new DeleteBillApi(+billId))
        .then(() => {
          hideModal(ModalNames.CONFIRMATION);
          navigate('/bank/bills');
        })
        .catch(err => hideModal(ModalNames.CONFIRMATION));
    }
  }, [billId, request, hideModal, navigate]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="700" fontSize="14px">
            {bill.amount}
          </Typography>
          {options.length > 0 && (
            <>
              <IconButton onClick={onMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClick={onMenuClose}>
                {options.map(option => (
                  <MenuItem key={option.path} onClick={onMenuClick(option)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
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
        {new Date(bill.updatedAt) > new Date(bill.createdAt) && (
          <Typography fontSize="12px" color="">
            last update: {moment(bill.updatedAt).format('LLLL')}
          </Typography>
        )}
        <Box mt="30px">
          {/**@ts-ignore */}
          <Button
            disabled={isDeleteBillProcessing}
            loading={isDeleteBillProcessing}
            onClick={onDeleteBill}
            type="danger"
          >
            Deleting the bill
          </Button>
        </Box>
      </Box>
      <Modal
        title="Deleting the Bill"
        body="Are you sure do delete the bill?"
        isLoading={isDeleteBillProcessing}
        isActive={modals[ModalNames.CONFIRMATION]}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteBill()}
      />
    </>
  );
};

export default Details;

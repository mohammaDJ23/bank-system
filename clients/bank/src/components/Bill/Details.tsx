import { Box, Typography, Menu, MenuItem, IconButton, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { BillObj, getDynamicPath, Pathes } from '../../lib';
import { ModalNames } from '../../store';
import { DeleteBillApi } from '../../apis';

interface DetailsImporation {
  bill: BillObj;
}

const Details: FC<DetailsImporation> = ({ bill }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { isApiProcessing, request } = useRequest();
  const isDeleteBillApiProcessing = isApiProcessing(DeleteBillApi);
  const options = [{ label: 'Update', path: getDynamicPath(Pathes.UPDATE_BILL, { id: bill.id }) }];

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(
    (option: (typeof options)[number]) => {
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
    request<BillObj, string>(new DeleteBillApi(bill.id))
      .then(() => {
        hideModal(ModalNames.CONFIRMATION);
        navigate(Pathes.BILLS);
      })
      .catch(err => hideModal(ModalNames.CONFIRMATION));
  }, [bill, request, hideModal, navigate]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="700" fontSize="14px">
            {bill.amount}
          </Typography>
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
          <Button
            disabled={isDeleteBillApiProcessing}
            onClick={onDeleteBill}
            variant="contained"
            color="error"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          >
            Delete the bill
          </Button>
        </Box>
      </Box>
      <Modal
        title="Deleting the Bill"
        body="Are you sure do delete the bill?"
        isLoading={isDeleteBillApiProcessing}
        isActive={modals[ModalNames.CONFIRMATION]}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteBill()}
      />
    </>
  );
};

export default Details;

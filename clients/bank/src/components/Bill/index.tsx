import { Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import DefaultContainer from '../../layout/DefaultContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'element-react';
import { useAction, useRequest, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useEffect, useState } from 'react';
import Skeleton from '../Skeleton';
import { Apis } from '../../apis';
import { BillObj } from '../../lib';

const BillContent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bill, setBill] = useState<BillObj | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const params = useParams();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { isInitialApiProcessing, isApiProcessing, request } = useRequest();
  const isBillProcessing = isInitialApiProcessing(Apis.BILL);
  const isDeleteBillProcessing = isApiProcessing(Apis.DELETE_BILL);
  const options = bill ? [{ label: 'Update', path: `/bank/update-bill/${bill.id}` }] : [];
  const billId = params.id;

  useEffect(() => {
    if (billId) {
      request<number, BillObj>(Apis.BILL, {
        data: +billId,
        callback(response) {
          setBill(response.data);
        },
      });
    }
  }, [request, billId]);

  function onMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function onMenuClose() {
    setAnchorEl(null);
  }

  function onMenuClick(option: typeof options[number]) {
    return function () {
      onMenuClose();
      navigate(option.path);
    };
  }

  function onDeleteBill() {
    showModal(ModalNames.CONFIRMATION);
  }

  function deleteBill() {
    if (billId) {
      request(Apis.DELETE_BILL, {
        data: +billId,
        callback() {
          hideModal(ModalNames.CONFIRMATION);
          navigate('/bank/bills');
        },
      });
    }
  }

  function skeleton() {
    return (
      <Box width="100%" display="flex" alignItems="start" gap="12px" flexDirection="column">
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="15px"
          mb="15px"
        >
          <Box maxWidth="400px" width="100%" height="14px">
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box maxWidth="40px" width="100%" height="14px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box maxWidth="150px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="300px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="130px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="140px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
      </Box>
    );
  }

  function billDetails(bill: BillObj) {
    return (
      <>
        <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
          <Box
            width="100%"
            mb="15px"
            display="flex"
            gap="8px"
            justifyContent="space-between"
            alignItems="center"
          >
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
  }

  function notFound() {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="12px"
        mt="20px"
      >
        <Typography>Not found the bill</Typography>
        {/**@ts-ignore */}
        <Button onClick={() => navigate('/bank/bills')} type="primary">
          Back to the bill list
        </Button>
      </Box>
    );
  }

  return (
    <DefaultContainer>
      {isBillProcessing ? skeleton() : bill ? billDetails(bill) : notFound()}
    </DefaultContainer>
  );
};

export default BillContent;

import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Skeleton,
  styled,
  SkeletonProps,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import DefaultContainer from '../../layout/DefaultContainer';
import { useNavigate } from 'react-router-dom';
import { Button } from 'element-react';
import { useAction, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { useState } from 'react';

const StyledSkeleton = styled(Skeleton)<SkeletonProps>(({ theme, width, height }) => ({
  width,
  height,
  transform: 'scale(1)',
}));

const BillContent = () => {
  const bill = {
    id: 1,
    amount: '2342344',
    receiver: 'Mohammad nowresideh',
    description:
      'descosidjafoai;sd oasdijf;aosijdf ijidosj foiasdjfoia jsdiofjaiosdjfoiajsdifj aoisjdio fjaiosjdif iasdjfij aiosdjf',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date(new Date().getTime() + 1000).toISOString(),
    userId: 1,
  };
  const options = [{ label: 'Update', path: `/bank/update-user/${bill.id}` }];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const isBillProcessing = false;

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
            <StyledSkeleton width="100%" height="100%" />
          </Box>
          <Box maxWidth="40px" width="100%" height="14px">
            <StyledSkeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box maxWidth="150px" width="100%" height="12px">
          <StyledSkeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="300px" width="100%" height="12px">
          <StyledSkeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="130px" width="100%" height="12px">
          <StyledSkeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="140px" width="100%" height="12px">
          <StyledSkeleton width="100%" height="100%" />
        </Box>
      </Box>
    );
  }

  function billDetails() {
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
            <Button onClick={onDeleteBill} type="danger">
              Delete the bill
            </Button>
          </Box>
        </Box>
        <Modal
          title="Deleting the Bill"
          body="Are you sure do delete the bill?"
          isActive={modals[ModalNames.CONFIRMATION]}
          onCancel={() => hideModal(ModalNames.CONFIRMATION)}
          onConfirm={() => console.log('submit')}
        />
      </>
    );
  }

  return <DefaultContainer>{isBillProcessing ? skeleton() : billDetails()}</DefaultContainer>;
};

export default BillContent;

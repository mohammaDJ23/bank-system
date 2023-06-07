import { Box, Typography, Button } from '@mui/material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { FC, useCallback } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { RestoreUserApi } from '../../apis';
import { Pathes, UserWithBillInfoObj } from '../../lib';
import { ModalNames } from '../../store';
import { useNavigate } from 'react-router-dom';

interface DetailsImporation {
  user: UserWithBillInfoObj;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const navigate = useNavigate();
  const { hideModal, showModal } = useAction();
  const { modals } = useSelector();
  const { isApiProcessing, request } = useRequest();
  const { isOwner } = useAuth();
  const isCurrentUserOwner = isOwner(user.role);
  const isRestoreUserApiProcessing = isApiProcessing(RestoreUserApi);

  const showRestoreUserModal = useCallback(() => {
    showModal(ModalNames.RESTORE_USER);
  }, []);

  const hideRestoreUserModal = useCallback(() => {
    hideModal(ModalNames.RESTORE_USER);
  }, []);

  const restoreUser = useCallback(() => {
    request(new RestoreUserApi(user.id)).then(response => {
      navigate(Pathes.USERS);
    });
  }, [user]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="700" fontSize="16px">
            {user.firstName} {user.lastName}
          </Typography>
        </Box>
        <Typography fontSize="12px" color="">
          email: {user.email}
        </Typography>
        <Typography fontSize="12px" color="">
          phone: {user.phone}
        </Typography>
        <Typography fontSize="12px" color="">
          role: {user.role}
        </Typography>
        <Typography fontSize="12px" color="">
          created by: {user.parent.firstName} {user.parent.lastName} ({user.parent.role}){' '}
          {user.parent.deletedAt && `was deleted at ${moment(user.parent.deletedAt).format('LLLL')}`}
        </Typography>
        {isCurrentUserOwner && (
          <Typography fontSize="12px" color="">
            total created users: {user.users.quantities}
          </Typography>
        )}
        <Typography fontSize="12px" color="">
          total bill quantities: {user.bill.counts}
        </Typography>
        <Typography fontSize="12px" color="">
          total bill amounts: {user.bill.amounts}
        </Typography>
        <Typography fontSize="12px" color="">
          created at: {moment(user.createdAt).format('LLLL')}
        </Typography>
        {new Date(user.updatedAt) > new Date(user.createdAt) && (
          <Typography fontSize="12px" color="">
            last update: {moment(user.updatedAt).format('LLLL')}
          </Typography>
        )}
        <Typography fontSize="12px" color="">
          was deleted at: {moment(user.deletedAt).format('LLLL')}
        </Typography>
        <Box mt="30px">
          <Button
            disabled={isRestoreUserApiProcessing}
            onClick={showRestoreUserModal}
            variant="contained"
            color="success"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          >
            Restore the user
          </Button>
        </Box>
      </Box>

      <Modal
        title="Restoring the user"
        body="Are you sure to restore the user?"
        isLoading={isRestoreUserApiProcessing}
        isActive={modals[ModalNames.RESTORE_USER]}
        onCancel={hideRestoreUserModal}
        onConfirm={restoreUser}
      />
    </>
  );
};

export default Details;

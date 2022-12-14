import { Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import { Button } from 'element-react';
import Modal from '../Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useRequest, useSelector } from '../../hooks';
import { apis, Apis } from '../../apis';
import { UserObj } from '../../lib';
import { ModalNames } from '../../store';

interface DetailsImporation {
  user: UserObj;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const params = useParams();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { isApiProcessing, request } = useRequest();
  const isDeletingUserProcessing = isApiProcessing(Apis.DELETE_USER);
  const options = user ? [{ label: 'Update', path: `/bank/update-user/${user.id}` }] : [];
  const userId = params.id;

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

  const onDeleteAccount = useCallback(() => {
    showModal(ModalNames.CONFIRMATION);
  }, [showModal]);

  const deleteUser = useCallback(() => {
    if (userId) {
      request({
        apiName: Apis.DELETE_USER,
        data: apis[Apis.DELETE_USER](+userId),
        config: { baseURL: process.env.USER_SERVICE },
        afterRequest() {
          hideModal(ModalNames.CONFIRMATION);
          navigate('/bank/users');
        },
      });
    }
  }, [userId, request, hideModal, navigate]);

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
          <Typography fontWeight="700" fontSize="16px">
            {user.firstName} {user.lastName}
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
          email: {user.email}
        </Typography>
        <Typography fontSize="12px" color="">
          phone: {user.phone}
        </Typography>
        <Typography fontSize="12px" color="">
          role: {user.role}
        </Typography>
        <Typography fontSize="12px" color="">
          created at: {moment(user.createdAt).format('LLLL')}
        </Typography>
        {new Date(user.updatedAt) > new Date(user.createdAt) && (
          <Typography fontSize="12px" color="">
            last update: {moment(user.updatedAt).format('LLLL')}
          </Typography>
        )}
        <Box mt="30px">
          {/**@ts-ignore */}
          <Button
            disabled={isDeletingUserProcessing}
            loading={isDeletingUserProcessing}
            onClick={onDeleteAccount}
            type="danger"
          >
            Deleting the account
          </Button>
        </Box>
      </Box>

      <Modal
        title="Deleting the Account"
        body="Are you sure do delete the user account?"
        isLoading={isDeletingUserProcessing}
        isActive={modals[ModalNames.CONFIRMATION]}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteUser()}
      />
    </>
  );
};

export default Details;

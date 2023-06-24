import { Box, Typography, Menu, MenuItem, IconButton, Button, CircularProgress } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import moment from 'moment';
import Modal from '../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useState } from 'react';
import { useAction, useAuth, useRequest, useSelector } from '../../hooks';
import { DeleteUserApi, DownloadBillReportApi } from '../../apis';
import { UserWithBillInfoObj, UserObj, Pathes, getDynamicPath, UserRoles, LocalStorage } from '../../lib';
import { ModalNames } from '../../store';

interface DetailsImporation {
  user: UserWithBillInfoObj;
}

const Details: FC<DetailsImporation> = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { isApiProcessing, request } = useRequest();
  const { isOwner, getTokenInfo, hasUserAuthorized } = useAuth();
  const isUserOwner = isOwner();
  const isCurrentUserOwner = isOwner(user.role);
  const isAuthorized = hasUserAuthorized(user);
  const userInfo = getTokenInfo();
  const isUserExist = !!userInfo;
  const isDeleteUserApiProcessing = isApiProcessing(DeleteUserApi);
  const isDownloadBillReportApiProcessing = isApiProcessing(DownloadBillReportApi);
  const options = [
    {
      label: 'Update',
      path: isUserOwner
        ? getDynamicPath(Pathes.UPDATE_USER_BY_OWNER, { id: user.id })
        : getDynamicPath(Pathes.UPDATE_USER, { id: user.id }),
    },
  ];

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

  const onDeleteAccount = useCallback(() => {
    showModal(ModalNames.CONFIRMATION);
  }, [showModal]);

  const deleteUser = useCallback(() => {
    request<UserObj, number>(new DeleteUserApi(user.id))
      .then(response => {
        hideModal(ModalNames.CONFIRMATION);
        if (isUserExist) {
          if ((userInfo.role === UserRoles.OWNER && userInfo.id === user.id) || userInfo.role !== UserRoles.OWNER) {
            LocalStorage.clear();
            navigate(Pathes.LOGIN);
          } else {
            navigate(Pathes.USERS);
          }
        } else {
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        }
      })
      .catch(err => hideModal(ModalNames.CONFIRMATION));
  }, [user, isUserExist, userInfo, request, hideModal, navigate]);

  const downloadBillReport = useCallback(() => {
    if (isDownloadBillReportApiProcessing) return;

    request<Blob>(new DownloadBillReportApi(user.id)).then(response => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${user.firstName}-${user.lastName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }, [isDownloadBillReportApiProcessing, user, request]);

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" alignItems="start" gap="8px">
        <Box width="100%" mb="15px" display="flex" gap="8px" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="700" fontSize="16px">
            {user.firstName} {user.lastName}
          </Typography>
          {options.length > 0 && isAuthorized && (
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
        {isAuthorized && (
          <Box display="flex" alignItems="center" gap="8px">
            <Typography fontSize="12px" color="">
              the bill report:
            </Typography>
            <Box display="flex" alignItems="center" gap="10px">
              <Typography
                fontSize="12px"
                color="#20a0ff"
                component="span"
                sx={{ cursor: 'pointer' }}
                onClick={downloadBillReport}
              >
                download
              </Typography>
              {isDownloadBillReportApiProcessing && <CircularProgress size={10} />}
            </Box>
          </Box>
        )}
        {isAuthorized && (
          <Box mt="30px">
            <Button
              disabled={isDeleteUserApiProcessing}
              onClick={onDeleteAccount}
              variant="contained"
              color="error"
              size="small"
              sx={{ textTransform: 'capitalize' }}
            >
              Delete the account
            </Button>
          </Box>
        )}
      </Box>

      <Modal
        title="Deleting the Account"
        body="Are you sure do delete the user account?"
        isLoading={isDeleteUserApiProcessing}
        isActive={modals[ModalNames.CONFIRMATION]}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => deleteUser()}
      />
    </>
  );
};

export default Details;

import { useEffect, useState } from 'react';
import moment from 'moment';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import DefaultContainer from '../../layout/DefaultContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'element-react';
import { useAction, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import Skeleton from '../Skeleton';
import { UserObj } from '../../lib';
import { Apis, apis, ResetApi } from '../../apis';

const UserContent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<UserObj | null>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showModal, hideModal, asyncOp } = useAction();
  const { modals, loadings } = useSelector();
  const params = useParams();
  const isUserProcessing = loadings[Apis.USER] === undefined || loadings[Apis.USER];
  const options = user ? [{ label: 'Update', path: `/bank/update-user/${user.id}` }] : [];

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      asyncOp(async () => {
        const response = await ResetApi.req<UserObj>(apis[Apis.USER](+userId), {
          baseURL: process.env.USER_SERVICE,
        });
        setUser(response.data);
      }, Apis.USER);
    }
  }, [params, asyncOp]);

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

  function onDeleteAccount() {
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
            <Skeleton width="100%" height="100%" />
          </Box>
          <Box maxWidth="40px" width="100%" height="14px">
            <Skeleton width="100%" height="100%" />
          </Box>
        </Box>
        <Box maxWidth="180px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="280px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="130px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
        <Box maxWidth="250px" width="100%" height="12px">
          <Skeleton width="100%" height="100%" />
        </Box>
      </Box>
    );
  }

  function userDetails(user: UserObj) {
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
            <Button onClick={onDeleteAccount} type="danger">
              Deleting the account
            </Button>
          </Box>
        </Box>

        <Modal
          title="Deleting the Account"
          body="Are you sure do delete the user account?"
          isActive={modals[ModalNames.CONFIRMATION]}
          onCancel={() => hideModal(ModalNames.CONFIRMATION)}
          onConfirm={() => console.log('submit')}
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
        <Typography>Not found the user</Typography>
        {/**@ts-ignore */}
        <Button onClick={() => navigate('/bank/users')} type="primary">
          Back to the user list
        </Button>
      </Box>
    );
  }

  return (
    <DefaultContainer>
      {isUserProcessing ? skeleton() : user ? userDetails(user) : notFound()}
    </DefaultContainer>
  );
};

export default UserContent;

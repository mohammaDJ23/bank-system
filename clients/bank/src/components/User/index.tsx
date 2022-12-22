import { useState } from 'react';
import moment from 'moment';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import DefaultContainer from '../../layout/DefaultContainer';
import { useNavigate } from 'react-router-dom';
import { Button } from 'element-react';
import { useAction, useSelector } from '../../hooks';
import Modal from '../Modal';
import { ModalNames } from '../../store';

const UserContent = () => {
  const user = {
    id: 1,
    firstName: 'Mohammad',
    lastName: 'Nowresideh',
    email: 'mohammad.nowresideh@gmail.com',
    phone: '09174163042',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const options = [{ label: 'Update', path: `/bank/update-user/${user.id}` }];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();

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

  return (
    <>
      <DefaultContainer>
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
              Delete account
            </Button>
          </Box>
        </Box>
      </DefaultContainer>
      <Modal
        title="Delete Account"
        body="Are you sure do delete the user account?"
        isActive={modals[ModalNames.CONFIRMATION]}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => console.log('submit')}
      />
    </>
  );
};

export default UserContent;

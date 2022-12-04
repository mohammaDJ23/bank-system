import { PropsWithChildren, FC, useState } from 'react';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { routes } from '../lib';

interface StyledListItemTextAttr {
  active: boolean;
}

interface StyledListItemIconAttr {
  active: boolean;
}

const navigationItems = [
  { title: 'Create user', icon: <GroupAddIcon />, path: '/bank/create-user' },
  { title: 'Create bill', icon: <AddCardIcon />, path: '/bank/create-bill' },
  { title: 'users', icon: <SupervisorAccountIcon />, path: '/bank/users' },
  { title: 'bills', icon: <CreditCardIcon />, path: '/bank/bills' },
];

const AppBar = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 10,
  minHeight: '64px',
  width: '100%',
  backgroundColor: '#20a0ff',
  [theme.breakpoints.between('xs', 'sm')]: {
    minHeight: '48px',
    '.css-hyum1k-MuiToolbar-root': {
      minHeight: '48px',
    },
  },
}));

const ChildrenWrapper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  padding: '16px 14px 15px 14px',
}));

const StyledListItemText = styled(ListItemText)<StyledListItemTextAttr>(({ theme, active }) => ({
  color: active ? '#20a0ff' : 'inherit',
}));

const StyledListItemIcon = styled(ListItemIcon)<StyledListItemIconAttr>(({ theme, active }) => ({
  color: active ? '#20a0ff' : 'inherit',
}));

const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeRoute = routes.find(route => matchPath(route.path, location.pathname));
  const activeRouteTitle = activeRoute?.title || 'Bank system';

  function isPathActive(item: typeof navigationItems[number]) {
    return item.path === activeRoute?.path;
  }

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            {activeRouteTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <ChildrenWrapper>{children}</ChildrenWrapper>

      <Drawer sx={{ zIndex: 11 }} anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <DrawerHeader>
            <CloseIcon onClick={() => setOpen(false)} />
          </DrawerHeader>

          <Divider />

          <List>
            {navigationItems.map((item, index) => (
              <ListItem
                onClick={() => {
                  setOpen(false);
                  navigate(item.path);
                }}
                key={index}
                disablePadding
              >
                <ListItemButton>
                  <StyledListItemIcon active={isPathActive(item)}>{item.icon}</StyledListItemIcon>
                  <StyledListItemText active={isPathActive(item)} primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;

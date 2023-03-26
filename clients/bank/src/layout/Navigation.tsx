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
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Pathes, routes, UserRoles } from '../lib';
import { useAuth } from '../hooks';

interface StyledListItemTextAttr {
  active: string | undefined;
}

interface StyledListItemIconAttr {
  active: string | undefined;
}

const AppBar = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 10,
  minHeight: '64px',
  width: '100%',
  backgroundColor: '#20a0ff',
  transition: 'all 0.3s',
  [theme.breakpoints.between('xs', 'sm')]: {
    minHeight: '48px',
    '.css-hyum1k-MuiToolbar-root': {
      transition: 'all 0.3s',
      minHeight: '48px',
    },
  },
}));

const ChildrenWrapper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  transition: 'all 0.3s',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(6),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  padding: '16px 14px 15px 14px',
}));

const StyledListItemText = styled(Typography)<StyledListItemTextAttr>(({ theme, active }) => ({
  color: active ? '#20a0ff' : 'inherit',
}));

const StyledListItemIcon = styled(ListItemIcon)<StyledListItemIconAttr>(({ theme, active }) => ({
  color: active ? '#20a0ff' : 'inherit',
}));

const Navigation: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isUser, isUserAuthenticated, getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const isUserLoggedIn = isUserAuthenticated();
  const activeRoute = routes.find(route => matchPath(route.path, location.pathname));
  const activeRouteTitle = activeRoute?.title || 'Bank system';

  function getNavigationItems() {
    const navigationItems = [
      {
        title: 'Dashboard',
        icon: <DashboardIcon />,
        path: Pathes.DASHBOARD,
        redirectPath: Pathes.DASHBOARD,
        role: UserRoles.USER,
      },
      {
        title: 'Create user',
        icon: <GroupAddIcon />,
        path: Pathes.CREATE_USER,
        redirectPath: Pathes.CREATE_USER,
        role: UserRoles.ADMIN,
      },
      {
        title: 'Create bill',
        icon: <AddCardIcon />,
        path: Pathes.CREATE_BILL,
        redirectPath: Pathes.CREATE_BILL,
        role: UserRoles.USER,
      },
      {
        title: 'users',
        icon: <SupervisorAccountIcon />,
        path: Pathes.USERS,
        redirectPath: Pathes.USERS,
        role: UserRoles.ADMIN,
      },
      {
        title: 'bills',
        icon: <CreditCardIcon />,
        path: Pathes.BILLS,
        redirectPath: Pathes.BILLS,
        role: UserRoles.USER,
      },
    ];

    if (isUserInfoExist) {
      navigationItems.unshift({
        title: `${userInfo.firstName} ${userInfo.lastName}`,
        icon: <PersonIcon />,
        path: Pathes.USER,
        redirectPath: Pathes.USER.replace(':id', userInfo.id.toString()) as Pathes,
        role: UserRoles.USER,
      });
    }

    return navigationItems;
  }

  function isSamePath(item: ReturnType<typeof getNavigationItems>[number]) {
    return item.path === activeRoute?.path;
  }

  function isPathActive(item: ReturnType<typeof getNavigationItems>[number]) {
    const isActive = isSamePath(item);
    return isActive ? isActive.toString() : undefined;
  }

  return (
    <>
      <AppBar>
        <Toolbar>
          {isUserLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
          )}

          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            {activeRouteTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <ChildrenWrapper>{children}</ChildrenWrapper>

      {isUserLoggedIn && (
        <Drawer sx={{ zIndex: 11 }} anchor="left" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 250 }} role="presentation">
            <DrawerHeader>
              <CloseIcon onClick={() => setOpen(false)} />
            </DrawerHeader>

            <Divider />

            <List>
              {getNavigationItems().map((item, index) => {
                const navigationEl = (
                  <ListItem
                    onClick={() => {
                      setOpen(false);
                      if (!isSamePath(item)) navigate(item.redirectPath);
                    }}
                    key={index}
                    disablePadding
                  >
                    <ListItemButton>
                      <StyledListItemIcon active={isPathActive(item)}>{item.icon}</StyledListItemIcon>
                      <Box
                        component="div"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '10rem',
                          maxWidth: '10rem',
                        }}
                      >
                        <StyledListItemText fontSize="1rem" marginY="4px" noWrap active={isPathActive(item)}>
                          {item.title}
                        </StyledListItemText>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );

                return isAdmin() ? navigationEl : isUser(item.role) && navigationEl;
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navigation;

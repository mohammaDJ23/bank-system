import { PropsWithChildren, FC, useState, Fragment, useCallback } from 'react';
import { useLocation, useNavigate, matchPath, useParams, NavigateOptions } from 'react-router-dom';
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
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { styled } from '@mui/material/styles';
import { LocalStorage, Pathes, routes, UserRoles } from '../lib';
import { useAuth } from '../hooks';
import { MoreVert } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';

interface StyledListItemTextAttr {
  active: string | undefined;
}

interface StyledListItemIconAttr {
  active: string | undefined;
}

interface NavigationItemObj {
  title: string;
  icon: JSX.Element;
  roles?: UserRoles[];
  path?: Pathes;
  redirectPath?: Pathes;
  activationOptions?: boolean[];
  navigateOptions?: NavigateOptions;
  onClick?: () => void;
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
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

const MoreVertIcon = styled(MoreVert)(({}) => ({
  color: 'white',
}));

interface NavigationImportation extends PropsWithChildren {
  menuOptions?: (string | React.ReactElement)[];
  title?: string | React.ReactElement;
}

const Navigation: FC<NavigationImportation> = ({ children, menuOptions, title }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpened = Boolean(anchorEl);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { isUserAuthenticated, getTokenInfo } = useAuth();
  const userInfo = getTokenInfo();
  const isUserInfoExist = !!userInfo;
  const isUserLoggedIn = isUserAuthenticated();
  const activeRoute = routes.find(route => matchPath(route.path, location.pathname));
  const activeRouteTitle = activeRoute?.title || 'Bank system';

  const onMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onMenuClick = useCallback(() => {
    return function () {
      onMenuClose();
    };
  }, [onMenuClose]);

  function getNavigationItems() {
    const navigationItems: NavigationItemObj[] = [
      {
        title: 'Dashboard',
        icon: <DashboardIcon />,
        path: Pathes.DASHBOARD,
        redirectPath: Pathes.DASHBOARD,
      },
      {
        title: 'Create user',
        icon: <PersonAddAlt1Icon />,
        path: Pathes.CREATE_USER,
        redirectPath: Pathes.CREATE_USER,
        roles: [UserRoles.OWNER],
      },
      {
        title: 'Create bill',
        icon: <AddCardIcon />,
        path: Pathes.CREATE_BILL,
        redirectPath: Pathes.CREATE_BILL,
      },
      {
        title: 'Users',
        icon: <SupervisorAccountIcon />,
        path: Pathes.USERS,
        redirectPath: Pathes.USERS,
        roles: [UserRoles.OWNER, UserRoles.ADMIN],
      },
      {
        title: 'Deleted users',
        icon: <GroupRemoveIcon />,
        path: Pathes.DELETED_USERS,
        redirectPath: Pathes.DELETED_USERS,
        roles: [UserRoles.OWNER],
      },
      {
        title: 'Bills',
        icon: <CreditCardIcon />,
        path: Pathes.BILLS,
        redirectPath: Pathes.BILLS,
      },
      {
        title: 'Deleted bills',
        icon: <LayersClearIcon />,
        path: Pathes.DELETED_bILLS,
        redirectPath: Pathes.DELETED_bILLS,
      },
      {
        title: 'Logout',
        icon: <LogoutIcon />,
        onClick: () => {
          LocalStorage.clear();
          navigate(Pathes.LOGIN);
        },
      },
    ];

    if (isUserInfoExist) {
      navigationItems.unshift({
        title: `${userInfo.firstName} ${userInfo.lastName} (${userInfo.role})`,
        icon: <PersonIcon />,
        path: Pathes.USER,
        redirectPath: Pathes.USERS,
        navigateOptions: { state: { previousUserId: userInfo.id } },
        activationOptions: [userInfo.id === +(params.id as string)],
      });
    }

    return navigationItems;
  }

  function isActivationOptionsActive(item: ReturnType<typeof getNavigationItems>[number]) {
    let isActive = true;
    for (let i = 0; item.activationOptions && i < item.activationOptions.length; i++)
      isActive = isActive && item.activationOptions[i];
    return isActive;
  }

  function isSamePath(item: ReturnType<typeof getNavigationItems>[number]) {
    return item.path === activeRoute?.path;
  }

  function isPathActive(item: ReturnType<typeof getNavigationItems>[number]) {
    const isActive = isSamePath(item) && isActivationOptionsActive(item);
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
              onClick={() => setIsDrawerOpened(true)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
          )}

          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            {title || activeRouteTitle}
          </Typography>
        </Toolbar>

        {menuOptions && menuOptions.length > 0 && (
          <Box>
            <IconButton onClick={onMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={isMenuOpened} onClick={onMenuClose}>
              {menuOptions.map((menu, index) => (
                <MenuItem key={index} onClick={onMenuClick}>
                  {menu}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </AppBar>

      <ChildrenWrapper>{children}</ChildrenWrapper>

      {isUserLoggedIn && (
        <Drawer sx={{ zIndex: 11 }} anchor="left" open={isDrawerOpened} onClose={() => setIsDrawerOpened(false)}>
          <Box sx={{ width: 250 }} role="presentation">
            <DrawerHeader>
              <CloseIcon onClick={() => setIsDrawerOpened(false)} />
            </DrawerHeader>

            <Divider />

            <List>
              {getNavigationItems().map((item, index) => {
                const navigationEl = (
                  <ListItem
                    onClick={() => {
                      setIsDrawerOpened(false);

                      if (item.path && item.redirectPath && !isPathActive(item))
                        navigate(item.redirectPath, item.navigateOptions);

                      if (item.onClick) item.onClick.call({});
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

                return !item.roles ? (
                  navigationEl
                ) : isUserInfoExist ? (
                  item.roles.includes(userInfo.role) ? (
                    navigationEl
                  ) : (
                    <Fragment key={index}></Fragment>
                  )
                ) : (
                  <Fragment key={index}></Fragment>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default Navigation;

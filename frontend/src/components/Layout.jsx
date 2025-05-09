import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SportsCricket as CricketIcon,
  EmojiEvents as TrophyIcon,
  Score as ScoreIcon,
  FitnessCenter as TrainerIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Redirect user role to their dashboard if they're at the root dashboard
    if (user?.role === 'user' && location.pathname === '/dashboard') {
      navigate('/dashboard/user');
    }
  }, [user, location.pathname, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['admin', 'player']
    },
    {
      text: 'User Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard/user',
      roles: ['user']
    },
    {
      text: 'Teams',
      icon: <PeopleIcon />,
      path: '/dashboard/teams',
      roles: ['admin']
    },
    {
      text: 'Players',
      icon: <CricketIcon />,
      path: '/dashboard/players',
      roles: ['admin', 'user']
    },
    {
      text: 'Matches',
      icon: <TrophyIcon />,
      path: '/dashboard/matches',
      roles: ['admin', 'player', 'user']
    },
    {
      text: 'Scores',
      icon: <ScoreIcon />,
      path: '/dashboard/scores',
      roles: ['admin', 'player', 'user']
    },
    {
      text: 'Trainers',
      icon: <TrainerIcon />,
      path: '/dashboard/trainers',
      roles: ['admin']
    }
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          // Show all items for admin
          if (user.role === 'admin') {
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          }
          // For non-admin users, only show items for their role
          if (item.roles.includes(user.role)) {
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Cricket Management System - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 
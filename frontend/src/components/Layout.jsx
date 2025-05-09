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
  Button,
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SportsCricket as CricketIcon,
  EmojiEvents as TrophyIcon,
  Score as ScoreIcon,
  FitnessCenter as TrainerIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (user?.role === 'user' && location.pathname === '/dashboard') {
      navigate('/dashboard/user');
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  const fetchUpcomingMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/matches');
      const data = await response.json();
      if (response.ok) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = data
          .filter(match => new Date(match.date) > today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        
        setUpcomingMatches(upcoming);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMatchClick = (matchId) => {
    handleNotificationClose();
    navigate(`/dashboard/matches/${matchId}`);
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ 
        px: 2, 
        py: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => {
          if (user.role === 'admin' || item.roles.includes(user.role)) {
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&.Mui-selected': {
                    backgroundColor: `${theme.palette.primary.main}15`,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}25`,
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          }
          return null;
        })}
      </List>
      <Divider />
      <List sx={{ px: 2 }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: `${theme.palette.error.main}10`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: 'text.primary'
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'text.primary',
              fontWeight: 'bold'
            }}
          >
            Cricket Management System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Upcoming Matches">
              <IconButton 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                onClick={handleNotificationClick}
              >
                <Badge badgeContent={upcomingMatches.length} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 320,
                  maxHeight: 400,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upcoming Matches
                </Typography>
              </Box>
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <MenuItem 
                    key={match._id}
                    onClick={() => handleMatchClick(match._id)}
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}10`,
                      },
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {match.team1} vs {match.team2}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                          <Typography variant="body2">
                            {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" sx={{ fontSize: 16 }} />
                          <Typography variant="body2" noWrap>
                            {match.venue}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No upcoming matches
                  </Typography>
                </Box>
              )}
              <Divider />
              <Box sx={{ p: 1 }}>
                <Button
                  fullWidth
                  onClick={() => {
                    handleNotificationClose();
                    navigate('/dashboard/matches');
                  }}
                  sx={{ 
                    justifyContent: 'flex-start',
                    px: 2,
                    py: 1,
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                    },
                  }}
                >
                  View All Matches
                </Button>
              </Box>
            </Menu>
            <Button 
              color="inherit" 
              onClick={handleLogout} 
              startIcon={<LogoutIcon />}
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
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
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
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
          minHeight: '100vh',
          bgcolor: '#f5f7fa',
        }}
      >
        <Toolbar />
        <Box sx={{ 
          maxWidth: '1600px', 
          mx: 'auto',
          mt: 2
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Divider,
  Paper,
  Button,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  SportsCricket as CricketIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { alpha } from '@mui/material/styles';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/matches');
      const data = await response.json();
      if (response.ok) {
        setMatches(data);
      } else {
        setError(data.message || 'Failed to fetch matches');
        toast.error(data.message || 'Failed to fetch matches');
      }
    } catch (error) {
      setError('Error fetching matches');
      toast.error('Error fetching matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMatches = matches.filter(match => {
    const matchDate = new Date(match.date);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate.getTime() === today.getTime();
  });

  const upcomingMatches = matches
    .filter(match => {
      const matchDate = new Date(match.date);
      return matchDate > today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'info';
      case 'live':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const MatchCard = ({ match }) => {
    const matchDate = new Date(match.date);
    const isToday = matchDate.toDateString() === today.toDateString();

    // Ensure we're using string values for rendering
    const team1Name = typeof match.team1 === 'object' ? match.team1.name : match.team1;
    const team2Name = typeof match.team2 === 'object' ? match.team2.name : match.team2;

    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip
              label={match.status}
              color={getStatusColor(match.status)}
              size="small"
              sx={{ 
                fontWeight: 500,
                borderRadius: '4px',
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
            {isToday && (
              <Chip
                label="Today"
                color="primary"
                size="small"
                sx={{ 
                  fontWeight: 500,
                  borderRadius: '4px',
                  '& .MuiChip-label': {
                    px: 1,
                  }
                }}
              />
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {team1Name} vs {team2Name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2">
                  {new Date(match.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2">
                  {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <LocationIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            <Typography variant="body2">{match.venue}</Typography>
          </Box>

          {match.score && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Score
              </Typography>
              <Typography variant="body2">
                {match.score}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchMatches}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
    );
  }

  return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Today's Matches
            </Typography>
            {todayMatches.length > 0 ? (
              <Grid container spacing={3}>
                {todayMatches.map((match) => (
                  <Grid item xs={12} md={6} lg={4} key={match._id}>
                    <MatchCard match={match} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CricketIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No matches scheduled for today
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Upcoming Matches
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                endIcon={<NavigateNextIcon />}
                onClick={() => navigate('/dashboard/matches')}
                sx={{ 
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 2
                }}
              >
                View All
              </Button>
            </Box>
            {upcomingMatches.length > 0 ? (
              <Grid container spacing={3}>
                {upcomingMatches.map((match) => (
                  <Grid item xs={12} md={6} lg={4} key={match._id}>
                    <MatchCard match={match} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CricketIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No upcoming matches scheduled
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          {user.role === 'admin' ? 'Admin Dashboard' : `Welcome, ${user.name}`}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh">
            <IconButton 
              onClick={fetchMatches} 
              color="primary"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton 
              color="primary"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {renderContent()}
    </Box>
  );
};

export default Dashboard; 
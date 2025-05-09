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
  useMediaQuery
} from '@mui/material';
import {
  SportsCricket as CricketIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/matches');
      const data = await response.json();
      if (response.ok) {
        setMatches(data);
      } else {
        toast.error(data.message || 'Failed to fetch matches');
      }
    } catch (error) {
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

    return (
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip
              label={match.status}
              color={getStatusColor(match.status)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            {isToday && (
              <Chip
                label="Today"
                color="primary"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {match.team1} vs {match.team2}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarIcon fontSize="small" />
                <Typography variant="body2">
                  {new Date(match.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TimeIcon fontSize="small" />
                <Typography variant="body2">
                  {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <LocationIcon fontSize="small" />
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

  if (user.role === 'admin') {
    return (
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchMatches} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filter">
              <IconButton color="primary">
                <FilterIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Upcoming Matches
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {/* Handle view all */}}
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
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome, {user.name}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchMatches} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter">
            <IconButton color="primary">
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Upcoming Matches
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {/* Handle view all */}}
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
    </Box>
  );
};

export default Dashboard; 
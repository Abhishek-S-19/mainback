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
  useTheme,
  useMediaQuery,
  Button,
  Stack,
  IconButton
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  SportsSoccer as MatchIcon,
  School as TrainerIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    matches: 0,
    trainers: 0
  });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (user.role === 'admin') {
      fetchStats();
    }
  }, [user.role]);

  const fetchStats = async () => {
    try {
      const [teamsRes, playersRes, matchesRes, trainersRes] = await Promise.all([
        api.get('/teams'),
        api.get('/players'),
        api.get('/matches'),
        api.get('/trainers')
      ]);

      setStats({
        teams: teamsRes.data.length,
        players: playersRes.data.length,
        matches: matchesRes.data.length,
        trainers: trainersRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 1,
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  if (user.role === 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Teams"
              value={stats.teams}
              icon={<GroupIcon sx={{ color: '#1976d2' }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Players"
              value={stats.players}
              icon={<PersonIcon sx={{ color: '#2e7d32' }} />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Matches"
              value={stats.matches}
              icon={<MatchIcon sx={{ color: '#ed6c02' }} />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Trainers"
              value={stats.trainers}
              icon={<TrainerIcon sx={{ color: '#9c27b0' }} />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Quick Actions
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  href="/dashboard/teams"
                >
                  Add New Team
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  href="/dashboard/players"
                >
                  Add New Player
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  href="/dashboard/matches"
                >
                  Schedule New Match
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  href="/dashboard/trainers"
                >
                  Add New Trainer
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Regular user dashboard
  const [matches, setMatches] = useState({
    today: [],
    upcoming: []
  });

  useEffect(() => {
    if (user.role !== 'admin') {
      fetchMatches();
    }
  }, [user.role]);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayMatches = response.data.filter(match => {
        const matchDate = new Date(match.date);
        return matchDate >= today && matchDate < tomorrow;
      });

      const upcomingMatches = response.data
        .filter(match => new Date(match.date) >= tomorrow)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      setMatches({
        today: todayMatches,
        upcoming: upcomingMatches
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Scheduled':
        return 'primary';
      default:
        return 'default';
    }
  };

  const MatchCard = ({ match }) => (
    <Card 
      elevation={0}
      sx={{ 
        mb: 2, 
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 1,
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {match.homeTeam?.name} vs {match.awayTeam?.name}
            </Typography>
            <Chip
              label={match.status}
              color={getStatusColor(match.status)}
              size="small"
            />
          </Box>
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {new Date(match.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {match.time}
              </Typography>
            </Stack>
            
            <Stack spacing={0.5} alignItems="flex-end">
              <Typography variant="body2" color="text.secondary">
                {match.venue}
              </Typography>
              {match.homeTeamScore > 0 || match.awayTeamScore > 0 ? (
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {match.homeTeamScore} - {match.awayTeamScore}
                </Typography>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.name}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Today's Matches Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                Today's Matches
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                sx={{ 
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {matches.today.length > 0 ? (
              matches.today.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No matches scheduled for today.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Matches Section */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
              Upcoming Matches
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {matches.upcoming.length > 0 ? (
              matches.upcoming.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                No upcoming matches scheduled.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 
import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  SportsSoccer as MatchIcon,
  School as TrainerIcon,
} from '@mui/icons-material';
import api from '../utils/api';

const SummaryCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: '100%',
    }}
  >
    <Box
      sx={{
        backgroundColor: `${color}20`,
        borderRadius: '50%',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  </Paper>
);

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teams: 0,
    players: 0,
    matches: 0,
    trainers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teamsRes, playersRes, matchesRes, trainersRes] = await Promise.all([
          api.get('/teams'),
          api.get('/players'),
          api.get('/matches'),
          api.get('/trainers'),
        ]);

        setStats({
          teams: teamsRes.data.length,
          players: playersRes.data.length,
          matches: matchesRes.data.length,
          trainers: trainersRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Teams"
            value={stats.teams}
            icon={<GroupIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Players"
            value={stats.players}
            icon={<PersonIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Matches"
            value={stats.matches}
            icon={<MatchIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Trainers"
            value={stats.trainers}
            icon={<TrainerIcon sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 
import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import api from '../utils/api';

const UserDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchPlayers();
    fetchMatches();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const upcomingMatches = matches.filter(match => new Date(match.date) > new Date());
  const completedMatches = matches.filter(match => new Date(match.date) <= new Date());

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cricket Dashboard
      </Typography>

      {/* Players Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Players
        </Typography>
        <Grid container spacing={3}>
          {players.map((player) => (
            <Grid item xs={12} sm={6} md={4} key={player._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={player.profile?.photoUrl || 'https://via.placeholder.com/200'}
                  alt={player.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {player.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Team: {player.team?.name || 'Not Assigned'}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Runs: {player.profile?.stats?.runs || 0}
                    </Typography>
                    <Typography variant="body2">
                      Wickets: {player.profile?.stats?.wickets || 0}
                    </Typography>
                    <Typography variant="body2">
                      Matches: {player.profile?.stats?.matches || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Matches Section */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Upcoming Matches" />
            <Tab label="Completed Matches" />
          </Tabs>
        </Box>

        {/* Upcoming Matches */}
        {tabValue === 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Teams</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingMatches.map((match) => (
                  <TableRow key={match._id}>
                    <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                    <TableCell>{match.time}</TableCell>
                    <TableCell>
                      {match.homeTeam?.name} vs {match.awayTeam?.name}
                    </TableCell>
                    <TableCell>{match.venue}</TableCell>
                    <TableCell>
                      <Chip 
                        label="Upcoming" 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Completed Matches */}
        {tabValue === 1 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Teams</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedMatches.map((match) => (
                  <TableRow key={match._id}>
                    <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {match.homeTeam?.name} vs {match.awayTeam?.name}
                    </TableCell>
                    <TableCell>
                      {match.homeTeamScore} - {match.awayTeamScore}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={match.status} 
                        color={match.status === 'Completed' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default UserDashboard; 
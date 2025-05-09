import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    venue: '',
    homeTeam: '',
    awayTeam: '',
    status: 'Scheduled',
    homeTeamScore: 0,
    awayTeamScore: 0
  });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleOpen = (match = null) => {
    if (match) {
      setSelectedMatch(match);
      setFormData({
        date: match.date,
        time: match.time,
        venue: match.venue,
        homeTeam: match.homeTeam?._id || '',
        awayTeam: match.awayTeam?._id || '',
        status: match.status,
        homeTeamScore: match.homeTeamScore || 0,
        awayTeamScore: match.awayTeamScore || 0
      });
    } else {
      setSelectedMatch(null);
      setFormData({
        date: '',
        time: '',
        venue: '',
        homeTeam: '',
        awayTeam: '',
        status: 'Scheduled',
        homeTeamScore: 0,
        awayTeamScore: 0
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMatch(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMatch) {
        await api.put(`/matches/${selectedMatch._id}`, formData);
      } else {
        await api.post('/matches', formData);
      }
      fetchMatches();
      handleClose();
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await api.delete(`/matches/${id}`);
        fetchMatches();
      } catch (error) {
        console.error('Error deleting match:', error);
      }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Matches
        </Typography>
        {user.role === 'admin' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Match
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Teams</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
              {user.role === 'admin' && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match._id}>
                <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                <TableCell>{match.time}</TableCell>
                <TableCell>
                  {match.homeTeam?.name} vs {match.awayTeam?.name}
                </TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>
                  {match.homeTeamScore} - {match.awayTeamScore}
                </TableCell>
                <TableCell>
                  <Chip
                    label={match.status}
                    color={getStatusColor(match.status)}
                    size="small"
                  />
                </TableCell>
                {user.role === 'admin' && (
                  <TableCell>
                    <IconButton onClick={() => handleOpen(match)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(match._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {user.role === 'admin' && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{selectedMatch ? 'Edit Match' : 'Add New Match'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label="Home Team"
                value={formData.homeTeam}
                onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                margin="normal"
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Home Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Away Team"
                value={formData.awayTeam}
                onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                margin="normal"
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Away Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Home Team Score"
                type="number"
                value={formData.homeTeamScore}
                onChange={(e) => setFormData({ ...formData, homeTeamScore: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Away Team Score"
                type="number"
                value={formData.awayTeamScore}
                onChange={(e) => setFormData({ ...formData, awayTeamScore: e.target.value })}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedMatch ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Matches; 
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
  useMediaQuery,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeamPlayers, setSelectedTeamPlayers] = useState([]);
  const [showPlayersDialog, setShowPlayersDialog] = useState(false);
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    date: '',
    venue: '',
    status: 'Scheduled',
    umpires: [''],
    result: {
      team1Score: {
        runs: 0,
        wickets: 0,
        overs: 0
      },
      team2Score: {
        runs: 0,
        wickets: 0,
        overs: 0
      }
    }
  });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchPlayers();
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

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleOpen = (match = null) => {
    if (match) {
      setSelectedMatch(match);
      setFormData({
        team1: match.team1?._id || '',
        team2: match.team2?._id || '',
        date: match.date,
        venue: match.venue,
        status: match.status,
        umpires: match.umpires || [''],
        result: {
          team1Score: match.result?.team1Score || { runs: 0, wickets: 0, overs: 0 },
          team2Score: match.result?.team2Score || { runs: 0, wickets: 0, overs: 0 }
        }
      });
    } else {
      setSelectedMatch(null);
      setFormData({
        team1: '',
        team2: '',
        date: '',
        venue: '',
        status: 'Scheduled',
        umpires: [''],
        result: {
          team1Score: {
            runs: 0,
            wickets: 0,
            overs: 0
          },
          team2Score: {
            runs: 0,
            wickets: 0,
            overs: 0
          }
        }
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
      // Convert date string to Date object
      const matchData = {
        ...formData,
        date: new Date(formData.date)
      };

      if (selectedMatch) {
        await api.put(`/matches/${selectedMatch._id}`, matchData);
      } else {
        await api.post('/matches', matchData);
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

  const handleTeamSelect = (teamId) => {
    const teamPlayers = players.filter(player => player.team === teamId);
    setSelectedTeamPlayers(teamPlayers);
    setShowPlayersDialog(true);
  };

  const handleClosePlayersDialog = () => {
    setShowPlayersDialog(false);
    setSelectedTeamPlayers([]);
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
                  {match.team1?.name} vs {match.team2?.name}
                </TableCell>
                <TableCell>{match.venue}</TableCell>
                <TableCell>
                  {match.result?.team1Score.runs} - {match.result?.team2Score.runs}
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
        <>
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{selectedMatch ? 'Edit Match' : 'Add New Match'}</DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  select
                  label="Team 1"
                  value={formData.team1}
                  onChange={(e) => {
                    setFormData({ ...formData, team1: e.target.value });
                    if (e.target.value) {
                      handleTeamSelect(e.target.value);
                    }
                  }}
                  margin="normal"
                  required
                >
                  <MenuItem value="">Select Team 1</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="Team 2"
                  value={formData.team2}
                  onChange={(e) => {
                    setFormData({ ...formData, team2: e.target.value });
                    if (e.target.value) {
                      handleTeamSelect(e.target.value);
                    }
                  }}
                  margin="normal"
                  required
                >
                  <MenuItem value="">Select Team 2</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Date and Time"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  margin="normal"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  margin="normal"
                  required
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Umpires"
                  value={formData.umpires.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    umpires: e.target.value.split(',').map(u => u.trim()) 
                  })}
                  margin="normal"
                  required
                  helperText="Enter umpire names separated by commas"
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

          <Dialog 
            open={showPlayersDialog} 
            onClose={handleClosePlayersDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Team Players</DialogTitle>
            <DialogContent>
              <List>
                {selectedTeamPlayers.length > 0 ? (
                  selectedTeamPlayers.map((player) => (
                    <ListItem key={player._id}>
                      <ListItemAvatar>
                        <Avatar>
                          {player.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.name}
                        secondary={`${player.role} - ${player.battingStyle || 'N/A'} ${player.bowlingStyle ? `(${player.bowlingStyle})` : ''}`}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No players registered in this team" />
                  </ListItem>
                )}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePlayersDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default Matches; 
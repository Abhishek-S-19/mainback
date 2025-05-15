import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Stack,
  Paper,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  EmojiEvents as TrophyIcon,
  SportsCricket as CricketIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { tournamentService } from '../services/tournamentService';
import { teamService } from '../services/teamService';

const Tournaments = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    teams: [],
    status: 'upcoming'
  });

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getAllTournaments();
      setTournaments(data);
    } catch (error) {
      toast.error('Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (error) {
      toast.error('Failed to fetch teams');
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const handleOpenDialog = (tournament = null) => {
    if (tournament) {
      setSelectedTournament(tournament);
      setFormData({
        name: tournament.name,
        startDate: tournament.startDate.split('T')[0],
        endDate: tournament.endDate.split('T')[0],
        teams: tournament.teams,
        status: tournament.status
      });
    } else {
      setSelectedTournament(null);
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        teams: [],
        status: 'upcoming'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTournament(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      teams: [],
      status: 'upcoming'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTournament) {
        await tournamentService.updateTournament(selectedTournament._id, formData);
        toast.success('Tournament updated successfully');
      } else {
        await tournamentService.createTournament(formData);
        toast.success('Tournament created successfully');
      }
      handleCloseDialog();
      fetchTournaments();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (tournament) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await tournamentService.deleteTournament(tournament._id);
        toast.success('Tournament deleted successfully');
        fetchTournaments();
      } catch (error) {
        toast.error('Failed to delete tournament');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const TournamentCard = ({ tournament }) => {
    const [showMatches, setShowMatches] = useState(false);

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {tournament.name}
            </Typography>
            <Chip
              label={tournament.status}
              color={getStatusColor(tournament.status)}
              size="small"
            />
          </Box>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Start: {new Date(tournament.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              End: {new Date(tournament.endDate).toLocaleDateString()}
            </Typography>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Participating Teams:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tournament.teams.map((teamId) => {
                const team = teams.find(t => t._id === teamId);
                return team ? (
                  <Chip
                    key={teamId}
                    label={team.name}
                    size="small"
                    variant="outlined"
                  />
                ) : null;
              })}
            </Stack>
          </Box>

          {tournament.matches && tournament.matches.length > 0 && (
            <Box>
              <Button
                size="small"
                onClick={() => setShowMatches(!showMatches)}
                startIcon={<CricketIcon />}
              >
                {showMatches ? 'Hide Matches' : 'Show Matches'}
              </Button>

              {showMatches && (
                <Box sx={{ mt: 2 }}>
                  {tournament.matches.map((match) => {
                    const team1 = teams.find(t => t._id === match.team1);
                    const team2 = teams.find(t => t._id === match.team2);
                    const winner = teams.find(t => t._id === match.winner);
                    
                    return (
                      <Paper
                        key={match._id}
                        sx={{
                          p: 2,
                          mb: 1,
                          backgroundColor: theme.palette.background.default
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {team1?.name || 'Team 1'} vs {team2?.name || 'Team 2'}
                        </Typography>
                        {match.score && (
                          <Typography variant="body2" color="primary">
                            Score: {match.score}
                          </Typography>
                        )}
                        {match.winner && (
                          <Typography variant="body2" color="success.main">
                            Winner: {winner?.name || 'Unknown'}
                          </Typography>
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {user.role === 'admin' && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenDialog(tournament)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(tournament)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Tournaments
        </Typography>
        {user.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Tournament
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {tournaments.map((tournament) => (
          <Grid item xs={12} md={6} lg={4} key={tournament._id}>
            <TournamentCard tournament={tournament} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTournament ? 'Edit Tournament' : 'Create Tournament'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Tournament Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Teams</InputLabel>
                  <Select
                    multiple
                    value={formData.teams}
                    onChange={(e) => setFormData({ ...formData, teams: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const team = teams.find(t => t._id === value);
                          return (
                            <Chip key={value} label={team?.name || value} size="small" />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {teams.map((team) => (
                      <MenuItem key={team._id} value={team._id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedTournament ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Tournaments; 
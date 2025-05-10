import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, SportsCricket as CricketIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    role: '',
    team: '',
    battingStyle: '',
    bowlingStyle: '',
    stats: {
      matches: 0,
      runs: 0,
      wickets: 0,
      catches: 0,
      stumpings: 0
    }
  });
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
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

  const handleOpen = (player = null) => {
    if (player) {
      setSelectedPlayer(player);
      setFormData({
        name: player.name,
        age: player.age,
        role: player.role,
        team: player.team?._id || '',
        battingStyle: player.battingStyle || '',
        bowlingStyle: player.bowlingStyle || '',
        stats: {
          matches: player.stats?.matches || 0,
          runs: player.stats?.runs || 0,
          wickets: player.stats?.wickets || 0,
          catches: player.stats?.catches || 0,
          stumpings: player.stats?.stumpings || 0
        }
      });
    } else {
      setSelectedPlayer(null);
      setFormData({
        name: '',
        age: '',
        role: '',
        team: '',
        battingStyle: '',
        bowlingStyle: '',
        stats: {
          matches: 0,
          runs: 0,
          wickets: 0,
          catches: 0,
          stumpings: 0
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlayer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPlayer) {
        await api.put(`/players/${selectedPlayer._id}`, formData);
      } else {
        await api.post('/players', formData);
      }
      fetchPlayers();
      handleClose();
    } catch (error) {
      console.error('Error saving player:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/players/${id}`);
        fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Players
        </Typography>
        {user.role === 'admin' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Player
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {players.map((player) => (
          <Grid item xs={12} sm={6} md={4} key={player._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                      mr: 2
                    }}
                  >
                    {getInitials(player.name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {player.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {player.team?.name || 'Not Assigned'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Age: {player.age || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Batting Style: {player.battingStyle || '-'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Bowling Style: {player.bowlingStyle || '-'}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Statistics
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Chip
                        label={`${player.stats?.runs || 0} Runs`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Chip
                        label={`${player.stats?.wickets || 0} Wickets`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Chip
                        label={`${player.stats?.matches || 0} Matches`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              {user.role === 'admin' && (
                <CardActions>
                  <IconButton onClick={() => handleOpen(player)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(player._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {user.role === 'admin' && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>{selectedPlayer ? 'Edit Player' : 'Add New Player'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                margin="normal"
                required
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="Batsman">Batsman</MenuItem>
                <MenuItem value="Bowler">Bowler</MenuItem>
                <MenuItem value="All-rounder">All-rounder</MenuItem>
                <MenuItem value="Wicket-keeper">Wicket-keeper</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Team"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                margin="normal"
              >
                <MenuItem value="">Select Team</MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team._id} value={team._id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Batting Style"
                value={formData.battingStyle}
                onChange={(e) => setFormData({ ...formData, battingStyle: e.target.value })}
                margin="normal"
              >
                <MenuItem value="">Select Batting Style</MenuItem>
                <MenuItem value="Right-handed">Right-handed</MenuItem>
                <MenuItem value="Left-handed">Left-handed</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Bowling Style"
                value={formData.bowlingStyle}
                onChange={(e) => setFormData({ ...formData, bowlingStyle: e.target.value })}
                margin="normal"
              >
                <MenuItem value="">Select Bowling Style</MenuItem>
                <MenuItem value="Right-arm fast">Right-arm fast</MenuItem>
                <MenuItem value="Right-arm medium">Right-arm medium</MenuItem>
                <MenuItem value="Right-arm spin">Right-arm spin</MenuItem>
                <MenuItem value="Left-arm fast">Left-arm fast</MenuItem>
                <MenuItem value="Left-arm medium">Left-arm medium</MenuItem>
                <MenuItem value="Left-arm spin">Left-arm spin</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedPlayer ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Players; 
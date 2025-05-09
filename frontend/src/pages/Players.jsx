import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
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

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'role', label: 'Role' },
    { 
      id: 'team', 
      label: 'Team',
      render: (row) => row.team?.name || 'No team assigned'
    },
    { id: 'battingStyle', label: 'Batting Style' },
    { id: 'bowlingStyle', label: 'Bowling Style' },
  ];

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  const battingStyles = ['Right-handed', 'Left-handed'];
  const bowlingStyles = [
    'Right-arm fast',
    'Right-arm medium',
    'Right-arm spin',
    'Left-arm fast',
    'Left-arm medium',
    'Left-arm spin'
  ];

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      toast.error('Failed to fetch players');
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
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
        stats: player.stats || {
          matches: 0,
          runs: 0,
          wickets: 0,
          catches: 0,
          stumpings: 0
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        age: Number(formData.age)
      };

      if (selectedPlayer) {
        await api.put(`/players/${selectedPlayer._id}`, submitData);
        toast.success('Player updated successfully');
      } else {
        await api.post('/players', submitData);
        toast.success('Player created successfully');
      }
      handleClose();
      fetchPlayers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save player');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/players/${id}`);
      toast.success('Player deleted successfully');
      fetchPlayers();
    } catch (error) {
      toast.error('Failed to delete player');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Players</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Player
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={players}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedPlayer ? 'Edit Player' : 'Add New Player'}
        </DialogTitle>
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
              select
              fullWidth
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              margin="normal"
              required
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Team"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              margin="normal"
              required
            >
              {teams.map((team) => (
                <MenuItem key={team._id} value={team._id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Batting Style"
              value={formData.battingStyle}
              onChange={(e) => setFormData({ ...formData, battingStyle: e.target.value })}
              margin="normal"
            >
              {battingStyles.map((style) => (
                <MenuItem key={style} value={style}>
                  {style}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Bowling Style"
              value={formData.bowlingStyle}
              onChange={(e) => setFormData({ ...formData, bowlingStyle: e.target.value })}
              margin="normal"
            >
              {bowlingStyles.map((style) => (
                <MenuItem key={style} value={style}>
                  {style}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedPlayer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Players; 
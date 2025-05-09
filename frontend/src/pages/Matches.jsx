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

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
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

  const columns = [
    { 
      id: 'team1', 
      label: 'Team 1',
      render: (row) => row.team1?.name || 'Unknown'
    },
    { 
      id: 'team2', 
      label: 'Team 2',
      render: (row) => row.team2?.name || 'Unknown'
    },
    { 
      id: 'date', 
      label: 'Date',
      render: (row) => new Date(row.date).toLocaleDateString()
    },
    { id: 'venue', label: 'Venue' },
    { id: 'status', label: 'Status' },
  ];

  const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch matches');
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

  const handleOpen = (match = null) => {
    if (match) {
      setSelectedMatch(match);
      setFormData({
        team1: match.team1?._id || '',
        team2: match.team2?._id || '',
        date: new Date(match.date).toISOString().split('T')[0],
        venue: match.venue,
        status: match.status,
        umpires: match.umpires || [''],
        result: match.result || {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };

      if (selectedMatch) {
        await api.put(`/matches/${selectedMatch._id}`, submitData);
        toast.success('Match updated successfully');
      } else {
        await api.post('/matches', submitData);
        toast.success('Match created successfully');
      }
      handleClose();
      fetchMatches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save match');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/matches/${id}`);
      toast.success('Match deleted successfully');
      fetchMatches();
    } catch (error) {
      toast.error('Failed to delete match');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Matches</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Match
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={matches}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedMatch ? 'Edit Match' : 'Add New Match'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Team 1"
              value={formData.team1}
              onChange={(e) => setFormData({ ...formData, team1: e.target.value })}
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
              label="Team 2"
              value={formData.team2}
              onChange={(e) => setFormData({ ...formData, team2: e.target.value })}
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
              label="Venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              select
              fullWidth
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Umpire"
              value={formData.umpires[0]}
              onChange={(e) => setFormData({ 
                ...formData, 
                umpires: [e.target.value]
              })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedMatch ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Matches; 
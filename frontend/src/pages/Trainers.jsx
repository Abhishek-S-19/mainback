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

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    teams: [],
    specialization: '',
    experience: '',
    contact: {
      email: '',
      phone: ''
    }
  });

  const columns = [
    { id: 'name', label: 'Name' },
    { 
      id: 'teams', 
      label: 'Team',
      render: (row) => {
        const teamNames = row.teams?.map(team => team.name).join(', ') || '';
        return teamNames || 'No team assigned';
      }
    },
    { id: 'specialization', label: 'Specialization' },
    { id: 'experience', label: 'Experience (years)' },
    { id: 'contact.email', label: 'Email' },
    { id: 'contact.phone', label: 'Phone' },
  ];

  const specializations = [
    'Batting',
    'Bowling',
    'Fielding',
    'Fitness',
    'All-round'
  ];

  useEffect(() => {
    fetchTrainers();
    fetchTeams();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/trainers');
      setTrainers(response.data);
    } catch (error) {
      toast.error('Failed to fetch trainers');
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

  const handleOpen = (trainer = null) => {
    if (trainer) {
      setSelectedTrainer(trainer);
      setFormData({
        name: trainer.name,
        teams: trainer.teams || [],
        specialization: trainer.specialization,
        experience: trainer.experience,
        contact: {
          email: trainer.contact?.email || '',
          phone: trainer.contact?.phone || ''
        }
      });
    } else {
      setSelectedTrainer(null);
      setFormData({
        name: '',
        teams: [],
        specialization: '',
        experience: '',
        contact: {
          email: '',
          phone: ''
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrainer(null);
    setFormData({
      name: '',
      teams: [],
      specialization: '',
      experience: '',
      contact: {
        email: '',
        phone: ''
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        experience: Number(formData.experience)
      };

      if (selectedTrainer) {
        await api.put(`/trainers/${selectedTrainer._id}`, submitData);
        toast.success('Trainer updated successfully');
      } else {
        await api.post('/trainers', submitData);
        toast.success('Trainer created successfully');
      }
      handleClose();
      fetchTrainers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save trainer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/trainers/${id}`);
      toast.success('Trainer deleted successfully');
      fetchTrainers();
    } catch (error) {
      toast.error('Failed to delete trainer');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Trainers</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Trainer
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={trainers}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTrainer ? 'Edit Trainer' : 'Add New Trainer'}
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
              select
              fullWidth
              label="Team"
              value={formData.teams[0]?._id || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                teams: [e.target.value]
              })}
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
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              margin="normal"
              required
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Experience (years)"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, email: e.target.value }
              })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.contact.phone}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, phone: e.target.value }
              })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTrainer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Trainers; 
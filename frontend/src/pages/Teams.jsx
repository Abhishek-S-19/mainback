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
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  useTheme
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, People as PeopleIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../utils/api';

const validationSchema = yup.object({
  name: yup.string().required('Team name is required'),
  location: yup.string().required('Location is required'),
  foundedYear: yup
    .number()
    .required('Founded year is required')
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future'),
});

function Teams() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showPlayersDialog, setShowPlayersDialog] = useState(false);
  const [selectedTeamPlayers, setSelectedTeamPlayers] = useState([]);
  const theme = useTheme();

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (error) {
      toast.error('Failed to fetch players');
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const handleShowPlayers = (team) => {
    const teamPlayers = players.filter(player => player.team && player.team._id === team._id);
    setSelectedTeamPlayers(teamPlayers);
    setShowPlayersDialog(true);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      foundedYear: new Date().getFullYear(),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedTeam) {
          await api.put(`/teams/${selectedTeam._id}`, values);
          toast.success('Team updated successfully');
        } else {
          await api.post('/teams', values);
          toast.success('Team created successfully');
        }

        setOpenDialog(false);
        setSelectedTeam(null);
        formik.resetForm();
        fetchTeams();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    },
  });

  const handleEdit = (team) => {
    setSelectedTeam(team);
    formik.setValues({
      name: team.name,
      location: team.location,
      foundedYear: team.foundedYear,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (team) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.delete(`/teams/${team._id}`);
        toast.success('Team deleted successfully');
        fetchTeams();
      } catch (error) {
        toast.error('Failed to delete team');
      }
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">Teams</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedTeam(null);
            formik.resetForm();
            setOpenDialog(true);
          }}
        >
          Add Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teams.map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team._id}>
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
                    {team.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="div">
                      {team.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {team.location}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Founded: {team.foundedYear}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${team.players ? team.players.length : 0} Players`}
                    color="primary"
                    variant="outlined"
                    onClick={() => handleShowPlayers(team)}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(team)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(team)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedTeam ? 'Edit Team' : 'Add New Team'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Team Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
            <TextField
              fullWidth
              margin="normal"
              name="foundedYear"
              label="Founded Year"
              type="number"
              value={formik.values.foundedYear}
              onChange={formik.handleChange}
              error={
                formik.touched.foundedYear && Boolean(formik.errors.foundedYear)
              }
              helperText={
                formik.touched.foundedYear && formik.errors.foundedYear
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedTeam ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog 
        open={showPlayersDialog} 
        onClose={() => setShowPlayersDialog(false)}
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
          <Button onClick={() => setShowPlayersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Teams; 
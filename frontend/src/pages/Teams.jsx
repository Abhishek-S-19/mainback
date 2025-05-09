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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../utils/api';
import DataTable from '../components/DataTable';

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
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

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

  useEffect(() => {
    fetchTeams();
  }, []);

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
          await api.put(`/teams/${selectedTeam.id}`, values);
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
        await api.delete(`/teams/${team.id}`);
        toast.success('Team deleted successfully');
        fetchTeams();
      } catch (error) {
        toast.error('Failed to delete team');
      }
    }
  };

  const columns = [
    { id: 'name', label: 'Team Name' },
    { id: 'location', label: 'Location' },
    { id: 'foundedYear', label: 'Founded Year' },
  ];

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

      <DataTable
        columns={columns}
        data={teams}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
    </Box>
  );
}

export default Teams; 
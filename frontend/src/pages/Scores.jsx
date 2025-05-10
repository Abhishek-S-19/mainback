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
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import api from '../utils/api';

const Scores = () => {
  const [scores, setScores] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);
  const [formData, setFormData] = useState({
    match: '',
    player: '',
    team: '',
    batting: {
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      out: false,
      dismissalType: 'Not Out'
    },
    bowling: {
      overs: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0
    },
    fielding: {
      catches: 0,
      stumpings: 0,
      runOuts: 0
    }
  });

  const columns = [
    { 
      id: 'match', 
      label: 'Match',
      render: (row) => `${row.match?.team1?.name || ''} vs ${row.match?.team2?.name || ''}`
    },
    { 
      id: 'player', 
      label: 'Player',
      render: (row) => row.player?.name || ''
    },
    { 
      id: 'team', 
      label: 'Team',
      render: (row) => row.team?.name || ''
    },
    { 
      id: 'batting', 
      label: 'Batting',
      render: (row) => `${row.batting.runs} (${row.batting.balls})`
    },
    { 
      id: 'bowling', 
      label: 'Bowling',
      render: (row) => `${row.bowling.wickets}/${row.bowling.runs}`
    },
    { 
      id: 'fielding', 
      label: 'Fielding',
      render: (row) => `C:${row.fielding.catches} S:${row.fielding.stumpings} RO:${row.fielding.runOuts}`
    }
  ];

  const dismissalTypes = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Not Out'];

  useEffect(() => {
    fetchScores();
    fetchMatches();
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await api.get('/scores');
      setScores(response.data);
    } catch (error) {
      toast.error('Failed to fetch scores');
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch matches');
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

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
    }
  };

  const handleOpen = (score = null) => {
    if (score) {
      setSelectedScore(score);
      setFormData({
        match: score.match?._id || '',
        player: score.player?._id || '',
        team: score.team?._id || '',
        batting: score.batting || {
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          out: false,
          dismissalType: 'Not Out'
        },
        bowling: score.bowling || {
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          economy: 0
        },
        fielding: score.fielding || {
          catches: 0,
          stumpings: 0,
          runOuts: 0
        }
      });
    } else {
      setSelectedScore(null);
      setFormData({
        match: '',
        player: '',
        team: '',
        batting: {
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          out: false,
          dismissalType: 'Not Out'
        },
        bowling: {
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
          economy: 0
        },
        fielding: {
          catches: 0,
          stumpings: 0,
          runOuts: 0
        }
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedScore(null);
    setFormData({
      match: '',
      player: '',
      team: '',
      batting: {
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: 0,
        out: false,
        dismissalType: 'Not Out'
      },
      bowling: {
        overs: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: 0
      },
      fielding: {
        catches: 0,
        stumpings: 0,
        runOuts: 0
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedScore) {
        await api.put(`/scores/${selectedScore._id}`, formData);
        toast.success('Score updated successfully');
      } else {
        await api.post('/scores', formData);
        toast.success('Score created successfully');
      }
      handleClose();
      fetchScores();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save score');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/scores/${id}`);
      toast.success('Score deleted successfully');
      fetchScores();
    } catch (error) {
      toast.error('Failed to delete score');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Scores</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Score
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={scores}
        onEdit={handleOpen}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {selectedScore ? 'Edit Score' : 'Add New Score'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Match Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Match"
                  value={formData.match}
                  onChange={(e) => setFormData({ ...formData, match: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                >
                  {matches.map((match) => (
                    <MenuItem key={match._id} value={match._id}>
                      {`${match.team1?.name || ''} vs ${match.team2?.name || ''}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Team"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                >
                  {teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Player"
                  value={formData.player}
                  onChange={(e) => setFormData({ ...formData, player: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                >
                  {players.map((player) => (
                    <MenuItem key={player._id} value={player._id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Batting Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Batting Statistics
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Runs"
                  type="number"
                  value={formData.batting.runs}
                  onChange={(e) => setFormData({
                    ...formData,
                    batting: { ...formData.batting, runs: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Balls"
                  type="number"
                  value={formData.batting.balls}
                  onChange={(e) => setFormData({
                    ...formData,
                    batting: { ...formData.batting, balls: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fours"
                  type="number"
                  value={formData.batting.fours}
                  onChange={(e) => setFormData({
                    ...formData,
                    batting: { ...formData.batting, fours: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Sixes"
                  type="number"
                  value={formData.batting.sixes}
                  onChange={(e) => setFormData({
                    ...formData,
                    batting: { ...formData.batting, sixes: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Dismissal Type"
                  value={formData.batting.dismissalType}
                  onChange={(e) => setFormData({
                    ...formData,
                    batting: { ...formData.batting, dismissalType: e.target.value }
                  })}
                >
                  {dismissalTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Bowling Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Bowling Statistics
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Overs"
                  type="number"
                  value={formData.bowling.overs}
                  onChange={(e) => setFormData({
                    ...formData,
                    bowling: { ...formData.bowling, overs: parseFloat(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Maidens"
                  type="number"
                  value={formData.bowling.maidens}
                  onChange={(e) => setFormData({
                    ...formData,
                    bowling: { ...formData.bowling, maidens: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Runs"
                  type="number"
                  value={formData.bowling.runs}
                  onChange={(e) => setFormData({
                    ...formData,
                    bowling: { ...formData.bowling, runs: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Wickets"
                  type="number"
                  value={formData.bowling.wickets}
                  onChange={(e) => setFormData({
                    ...formData,
                    bowling: { ...formData.bowling, wickets: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              {/* Fielding Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Fielding Statistics
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Catches"
                  type="number"
                  value={formData.fielding.catches}
                  onChange={(e) => setFormData({
                    ...formData,
                    fielding: { ...formData.fielding, catches: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Stumpings"
                  type="number"
                  value={formData.fielding.stumpings}
                  onChange={(e) => setFormData({
                    ...formData,
                    fielding: { ...formData.fielding, stumpings: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Run Outs"
                  type="number"
                  value={formData.fielding.runOuts}
                  onChange={(e) => setFormData({
                    ...formData,
                    fielding: { ...formData.fielding, runOuts: parseInt(e.target.value) || 0 }
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'grey.200'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              px: 3,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            {selectedScore ? 'Update Score' : 'Add Score'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Scores; 
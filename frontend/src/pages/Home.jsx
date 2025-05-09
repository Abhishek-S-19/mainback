import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Hero Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', mt: 8 }}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to Cricket Management
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Your one-stop solution for managing cricket teams, matches, and scores
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ mr: 2, mb: 2 }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ mb: 2 }}
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <SportsCricketIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Team Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create and manage cricket teams with ease
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <SportsCricketIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Match Tracking
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Track matches and scores in real-time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <SportsCricketIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Player Stats
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor player performance and statistics
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <SportsCricketIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Trainer Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage team trainers and their specializations
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 
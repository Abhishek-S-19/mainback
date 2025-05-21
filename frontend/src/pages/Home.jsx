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
  CardMedia,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  SportsCricket as CricketIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  Score as ScoreIcon
} from '@mui/icons-material';

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          color: theme.palette.primary.main 
        }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/cricket-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2
                  }}
                >
                  Cricket Management System
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Your comprehensive solution for managing cricket teams, matches, and scores with ease
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mt: 4 }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      textTransform: 'none',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <img 
                  src="/assets/home.jpg" 
                  alt="Cricket Illustration"
                  style={{ 
                    width: '100%',
                    maxWidth: '500px',
                    height: 'auto'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: 6,
            fontWeight: 700,
            color: theme.palette.text.primary
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<CricketIcon sx={{ fontSize: 32 }} />}
              title="Match Management"
              description="Easily schedule, track, and manage cricket matches with real-time updates and comprehensive statistics."
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<PeopleIcon sx={{ fontSize: 32 }} />}
              title="Team Management"
              description="Manage teams, players, and staff with detailed profiles and performance tracking."
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<ScoreIcon sx={{ fontSize: 32 }} />}
              title="Score Tracking"
              description="Keep track of scores, statistics, and match results with our intuitive scoring system."
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <FeatureCard
              icon={<TrophyIcon sx={{ fontSize: 32 }} />}
              title="Tournament Management"
              description="Organize and manage tournaments with automated scheduling and result tracking."
            />
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: { xs: 6, md: 8 }
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: 600
              }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                opacity: 0.9
              }}
            >
              Join our platform today and transform your cricket management experience
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                }
              }}
            >
              Create Free Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
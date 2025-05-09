import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Teams from './pages/Teams';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Scores from './pages/Scores';
import Trainers from './pages/Trainers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Admin and Player Dashboard */}
              <Route index element={
                <ProtectedRoute requiredRole={['admin', 'player']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* User Dashboard */}
              <Route path="user" element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              } />

              {/* Admin only routes */}
              <Route
                path="teams"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Teams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="players"
                element={
                  <ProtectedRoute requiredRole={['admin', 'user']}>
                    <Players />
                  </ProtectedRoute>
                }
              />
              <Route
                path="trainers"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Trainers />
                  </ProtectedRoute>
                }
              />

              {/* Player and User routes */}
              <Route
                path="matches"
                element={
                  <ProtectedRoute requiredRole={['admin', 'player', 'user']}>
                    <Matches />
                  </ProtectedRoute>
                }
              />
              <Route
                path="scores"
                element={
                  <ProtectedRoute requiredRole={['admin', 'player', 'user']}>
                    <Scores />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

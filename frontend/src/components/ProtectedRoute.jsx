import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no role requirement, allow access
  if (!requiredRole) {
    return children;
  }

  // Handle array of allowed roles
  if (Array.isArray(requiredRole)) {
    if (requiredRole.includes(user.role)) {
      return children;
    }
  } 
  // Handle single role requirement
  else if (user.role === requiredRole) {
    return children;
  }

  // If role doesn't match, redirect to home
  return <Navigate to="/" replace />;
};

export default ProtectedRoute; 
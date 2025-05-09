import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(user);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(user);
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === requiredRole) return true;
    return false;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
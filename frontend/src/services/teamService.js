import axios from 'axios';
import { TEAM_API } from '../config/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const teamService = {
  getAllTeams: async () => {
    try {
      const response = await axios.get(TEAM_API.getAll(), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTeam: async (id) => {
    try {
      const response = await axios.get(TEAM_API.getById(id), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createTeam: async (teamData) => {
    try {
      const response = await axios.post(TEAM_API.create(), teamData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateTeam: async (id, teamData) => {
    try {
      const response = await axios.put(TEAM_API.update(id), teamData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteTeam: async (id) => {
    try {
      const response = await axios.delete(TEAM_API.delete(id), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 
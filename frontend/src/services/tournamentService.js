import axios from 'axios';
import { TOURNAMENT_API } from '../config/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const tournamentService = {
  getAllTournaments: async () => {
    try {
      const response = await axios.get(TOURNAMENT_API.getAll(), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getTournament: async (id) => {
    try {
      const response = await axios.get(TOURNAMENT_API.getById(id), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createTournament: async (tournamentData) => {
    try {
      const response = await axios.post(TOURNAMENT_API.create(), tournamentData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateTournament: async (id, tournamentData) => {
    try {
      const response = await axios.put(TOURNAMENT_API.update(id), tournamentData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteTournament: async (id) => {
    try {
      const response = await axios.delete(TOURNAMENT_API.delete(id), {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addMatch: async (tournamentId, matchData) => {
    try {
      const response = await axios.post(TOURNAMENT_API.addMatch(tournamentId), matchData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateMatchResult: async (tournamentId, matchId, resultData) => {
    try {
      const response = await axios.put(TOURNAMENT_API.updateMatch(tournamentId, matchId), resultData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}; 
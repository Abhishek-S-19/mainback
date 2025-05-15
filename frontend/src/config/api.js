const API_URL = 'http://localhost:5000/api';

export const TOURNAMENT_API = {
  getAll: () => `${API_URL}/tournaments`,
  getById: (id) => `${API_URL}/tournaments/${id}`,
  create: () => `${API_URL}/tournaments`,
  update: (id) => `${API_URL}/tournaments/${id}`,
  delete: (id) => `${API_URL}/tournaments/${id}`,
  addMatch: (id) => `${API_URL}/tournaments/${id}/matches`,
  updateMatch: (id, matchId) => `${API_URL}/tournaments/${id}/matches/${matchId}`
};

export const TEAM_API = {
  getAll: () => `${API_URL}/teams`,
  getById: (id) => `${API_URL}/teams/${id}`,
  create: () => `${API_URL}/teams`,
  update: (id) => `${API_URL}/teams/${id}`,
  delete: (id) => `${API_URL}/teams/${id}`
};

export const AUTH_API = {
  login: () => `${API_URL}/auth/login`,
  register: () => `${API_URL}/auth/register`,
  getProfile: () => `${API_URL}/auth/profile`
};

export const USER_API = {
  getAll: () => `${API_URL}/users`,
  getById: (id) => `${API_URL}/users/${id}`,
  create: () => `${API_URL}/users`,
  update: (id) => `${API_URL}/users/${id}`,
  delete: (id) => `${API_URL}/users/${id}`
}; 
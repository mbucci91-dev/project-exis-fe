import api from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Login
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    const { token, username: userName, status } = response.data.response;
    
    localStorage.setItem('token', token);
    
    const decodedToken = jwtDecode(token);
    
    return { token, user: { ...decodedToken, username: userName, status } };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },

  // Verifica se l'utente è autenticato
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Ottieni l'utente corrente dal token
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  // Ottieni il token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;

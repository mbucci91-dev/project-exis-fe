import api from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Login
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    // La risposta ha la struttura: { message, code, response: { token, username, status } }
    const { token, username: userName, status } = response.data.response;
    
    // Salva il token nel localStorage
    localStorage.setItem('token', token);
    
    // Decodifica il token per ottenere le informazioni utente
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
      // Verifica se il token è scaduto
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

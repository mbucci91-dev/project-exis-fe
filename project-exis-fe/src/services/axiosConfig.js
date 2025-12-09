import axios from 'axios';

// Crea un'istanza axios personalizzata
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://project-exis-be.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token JWT a ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestire errori di autenticazione
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token scaduto o non valido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

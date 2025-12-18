import api from './axiosConfig';

const userService = {
  // Ottieni il profilo dell'utente
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data.response;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/profile', userData);
    return response.data.response;
  },
};

export default userService;

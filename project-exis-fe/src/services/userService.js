import api from './axiosConfig';

const userService = {
  // Ottieni il profilo dell'utente
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Aggiorna il profilo dell'utente (opzionale per future implementazioni)
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
};

export default userService;

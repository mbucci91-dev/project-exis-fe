import api from './axiosConfig';

const userService = {
  // Ottieni il profilo dell'utente
  getProfile: async () => {
    const response = await api.get('/profile');
    // La risposta ha la struttura: { message, code, response: {...} }
    return response.data.response;
  },

  // Aggiorna il profilo dell'utente (opzionale per future implementazioni)
  updateProfile: async (userData) => {
    const response = await api.put('/profile', userData);
    return response.data.response;
  },
};

export default userService;

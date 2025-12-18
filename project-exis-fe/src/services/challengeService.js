import api from './axiosConfig';

const authService = {
  // Richiesta challenge PIN per operazioni sensibili
  requestChallenge: async () => {
    const response = await api.post('/auth/challenge');
    return response.data.response;
  },
};

export default authService;

import api from './axiosConfig';

const authService = {
  // Richiesta challenge PIN per operazioni sensibili
  requestChallenge: async () => {
    const response = await api.post('/auth/challenge');
    // Ritorna { indices_to_ask: [1, 5], challenge_token: "..." }
    return response.data.response;
  },
};

export default authService;

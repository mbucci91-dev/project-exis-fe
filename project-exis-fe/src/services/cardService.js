import api from './axiosConfig';
import { decryptFernetData } from '../utils/crypto';

const cardService = {
  // Ottieni tutte le carte dell'utente
  getCards: async () => {
    const response = await api.get('/cards');
    return response.data.response;
  },

  // Ottieni i dettagli di una carta specifica con challenge PIN
  getCardDetails: async (cardId, challengePayload) => {
    const response = await api.post(`/cards/${cardId}/details`, challengePayload);
    const data = response.data.response;
    
    if (data.temp_key && data.encrypted_data) {
    
      const decrypted = await decryptFernetData(data.temp_key, data.encrypted_data);
      return {
        ...data,
        decrypted_pan: decrypted.pan,
        decrypted_cvv: decrypted.cvv,
      };
    }
    
   
    return {
      ...data,
      decrypted_pan: data.pan,
      decrypted_cvv: data.cvv,
    };
  },

  // Blocca una carta con challenge PIN
  blockCard: async (cardId, challengePayload) => {
    const response = await api.post(`/cards/${cardId}/block`, challengePayload);
    return response.data.response;
  },

  // Ottieni i movimenti di una carta specifica
  getCardMovements: async (cardId) => {
    const response = await api.get(`/movements/${cardId}`);
    return response.data.response;
  },
};

export default cardService;

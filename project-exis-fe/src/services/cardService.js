import api from './axiosConfig';
import { decryptFernetData } from '../utils/crypto';

const cardService = {
  // Ottieni tutte le carte dell'utente
  getCards: async () => {
    const response = await api.get('/cards');
    // La risposta ha la struttura: { message, code, response: [...] }
    return response.data.response;
  },

  // Ottieni i dettagli di una carta specifica con challenge PIN
  // challengePayload: { digits: ["1", "5"], challenge_token: "..." }
  getCardDetails: async (cardId, challengePayload) => {
    const response = await api.post(`/cards/${cardId}/details`, challengePayload);
    const data = response.data.response;
    
    // Il backend invia dati cifrati con Fernet
    // Struttura: { temp_key: "...", encrypted_data: { pan: "token", cvv: "token" } }
    if (data.temp_key && data.encrypted_data) {
      // Decifra i dati usando la chiave temporanea
      const decrypted = await decryptFernetData(data.temp_key, data.encrypted_data);
      return {
        ...data,
        decrypted_pan: decrypted.pan,
        decrypted_cvv: decrypted.cvv,
      };
    }
    
    // Fallback: se il backend invia già in chiaro (per retrocompatibilità)
    return {
      ...data,
      decrypted_pan: data.pan,
      decrypted_cvv: data.cvv,
    };
  },

  // Blocca una carta con challenge PIN
  // challengePayload: { digits: ["1", "5"], challenge_token: "..." }
  blockCard: async (cardId, challengePayload) => {
    const response = await api.post(`/cards/${cardId}/block`, challengePayload);
    return response.data.response;
  },

  // Ottieni i movimenti di una carta specifica
  getCardMovements: async (cardId) => {
    const response = await api.get(`/movements/${cardId}`);
    // La risposta ha la struttura: { message, code, response: [...] }
    return response.data.response;
  },
};

export default cardService;

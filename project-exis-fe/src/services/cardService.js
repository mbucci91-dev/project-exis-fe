import api from './axiosConfig';

const cardService = {
  // Ottieni tutte le carte dell'utente
  getCards: async () => {
    const response = await api.get('/cards');
    return response.data;
  },

  // Ottieni i dettagli di una carta specifica
  getCardDetails: async (cardId) => {
    const response = await api.get(`/cards/${cardId}/details`);
    return response.data;
  },

  // Blocca una carta
  blockCard: async (cardId) => {
    const response = await api.post(`/cards/${cardId}/block`);
    return response.data;
  },

  // Ottieni i movimenti di una carta specifica
  getCardMovements: async (cardId) => {
    const response = await api.get(`/cards/${cardId}/movements`);
    return response.data;
  },
};

export default cardService;

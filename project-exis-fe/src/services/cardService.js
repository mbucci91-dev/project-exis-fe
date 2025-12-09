import api from './axiosConfig';

// Mock flag - Imposta a false quando il backend sarà pronto
const USE_MOCK_DATA = true;

const cardService = {
  // Ottieni tutte le carte dell'utente
  getCards: async () => {
    const response = await api.get('/cards');
    // La risposta ha la struttura: { message, code, response: [...] }
    return response.data.response;
  },

  // TODO: Da implementare nel backend - Endpoint: GET /cards/{cardId}/details
  // Ottieni i dettagli di una carta specifica (incluso PAN completo)
  getCardDetails: async (cardId) => {
    if (USE_MOCK_DATA) {
      // Mock dei dettagli carta
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: cardId,
            pan: '4532123456789010',
            pan_masked: '**** **** **** 9010',
            holder: 'MARIO ROSSI',
            exp_date: '12/2027',
            circuit: 'Visa',
            status: 'active',
            cvv: '123', // Solo per mock, non verrà mai esposto in produzione
          });
        }, 500); // Simula latenza di rete
      });
    }
    
    const response = await api.get(`/cards/${cardId}/details`);
    return response.data.response;
  },

  // TODO: Da implementare nel backend - Endpoint: POST /cards/{cardId}/block
  // Blocca una carta
  blockCard: async (cardId) => {
    if (USE_MOCK_DATA) {
      // Mock del blocco carta
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Carta bloccata con successo',
            cardId: cardId,
            newStatus: 'blocked',
          });
        }, 800); // Simula latenza di rete
      });
    }
    
    const response = await api.post(`/cards/${cardId}/block`);
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

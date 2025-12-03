import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cardService from '../../services/cardService';

// Thunk per ottenere tutte le carte
export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cardService.getCards();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Errore nel caricamento delle carte'
      );
    }
  }
);

// Thunk per ottenere i dettagli di una carta
export const fetchCardDetails = createAsyncThunk(
  'cards/fetchCardDetails',
  async (cardId, { rejectWithValue }) => {
    try {
      const data = await cardService.getCardDetails(cardId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Errore nel caricamento dei dettagli'
      );
    }
  }
);

// Thunk per bloccare una carta
export const blockCard = createAsyncThunk(
  'cards/blockCard',
  async (cardId, { rejectWithValue }) => {
    try {
      const data = await cardService.blockCard(cardId);
      return { cardId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Errore nel blocco della carta'
      );
    }
  }
);

const initialState = {
  cards: [],
  selectedCard: null,
  cardDetails: null,
  loading: false,
  error: null,
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    selectCard: (state, action) => {
      state.selectedCard = action.payload;
    },
    clearCardDetails: (state) => {
      state.cardDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cards
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
        // Seleziona automaticamente la prima carta se non ce n'è una selezionata
        if (!state.selectedCard && action.payload.length > 0) {
          state.selectedCard = action.payload[0];
        }
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch card details
      .addCase(fetchCardDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cardDetails = action.payload;
      })
      .addCase(fetchCardDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Block card
      .addCase(blockCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockCard.fulfilled, (state, action) => {
        state.loading = false;
        // Aggiorna lo stato della carta bloccata
        const cardIndex = state.cards.findIndex(
          (card) => card.id === action.payload.cardId
        );
        if (cardIndex !== -1) {
          state.cards[cardIndex].blocked = true;
        }
        if (state.selectedCard?.id === action.payload.cardId) {
          state.selectedCard.blocked = true;
        }
      })
      .addCase(blockCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectCard, clearCardDetails, clearError } = cardsSlice.actions;
export default cardsSlice.reducer;

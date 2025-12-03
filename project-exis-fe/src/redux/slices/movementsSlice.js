import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cardService from '../../services/cardService';

// Thunk per ottenere i movimenti di una carta
export const fetchMovements = createAsyncThunk(
  'movements/fetchMovements',
  async (cardId, { rejectWithValue }) => {
    try {
      const data = await cardService.getCardMovements(cardId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Errore nel caricamento dei movimenti'
      );
    }
  }
);

const initialState = {
  movements: [],
  loading: false,
  error: null,
};

const movementsSlice = createSlice({
  name: 'movements',
  initialState,
  reducers: {
    clearMovements: (state) => {
      state.movements = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload;
      })
      .addCase(fetchMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMovements, clearError } = movementsSlice.actions;
export default movementsSlice.reducer;

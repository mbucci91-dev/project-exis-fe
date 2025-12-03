import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cardsReducer from './slices/cardsSlice';
import movementsReducer from './slices/movementsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
    movements: movementsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

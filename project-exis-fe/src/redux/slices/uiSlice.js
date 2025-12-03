import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  notification: {
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  },
  modal: {
    open: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    openModal: (state, action) => {
      state.modal = {
        open: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        open: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  setLoading,
  showNotification,
  hideNotification,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;

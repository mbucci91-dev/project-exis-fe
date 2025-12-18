import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

/**
 * Componente per l'inserimento delle cifre del PIN richieste dal challenge
 * 
 * @param {boolean} open - Stato apertura dialog
 * @param {function} onClose - Callback chiusura
 * @param {function} onSubmit - Callback invio cifre
 * @param {array} indicesToAsk - Array di indici richiesti (es. [1, 5])
 * @param {boolean} loading - Stato loading
 * @param {string} title - Titolo del dialog
 */
const PinChallengeDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  indicesToAsk = [], 
  loading = false,
  title = 'Verifica di Sicurezza'
}) => {
  const [digits, setDigits] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDigits({});
      setError('');
    }
  }, [open]);

  const handleDigitChange = (index, value) => {
    // Accetta solo numeri singoli
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    setDigits(prev => ({
      ...prev,
      [index]: sanitized
    }));
    setError('');
  };

  const handleSubmit = () => {
    const allFilled = indicesToAsk.every(index => digits[index]?.length === 1);
    
    if (!allFilled) {
      setError('Inserisci tutte le cifre richieste');
      return;
    }
    const orderedDigits = indicesToAsk.map(index => digits[index]);
    onSubmit(orderedDigits);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      const currentIdx = indicesToAsk.indexOf(index);
      if (currentIdx < indicesToAsk.length - 1) {
        
        const nextIndex = indicesToAsk[currentIdx + 1];
        document.getElementById(`pin-digit-${nextIndex}`)?.focus();
      } else {
        
        handleSubmit();
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LockIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          Per motivi di sicurezza, inserisci le seguenti cifre del tuo PIN:
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
          {indicesToAsk.map((index, idx) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {index}ª cifra
              </Typography>
              <TextField
                id={`pin-digit-${index}`}
                type="password"
                variant="outlined"
                value={digits[index] || ''}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                disabled={loading}
                autoFocus={idx === 0}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    width: '50px',
                  }
                }}
                sx={{
                  '& input': {
                    letterSpacing: '0.5em',
                  }
                }}
              />
            </Box>
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          🔒 I tuoi dati sono protetti e crittografati
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
        >
          Annulla
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Verifica...' : 'Conferma'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinChallengeDialog;

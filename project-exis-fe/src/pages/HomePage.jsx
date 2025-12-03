import React, { useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, selectCard } from '../redux/slices/cardsSlice';
import { fetchMovements } from '../redux/slices/movementsSlice';
import CardCarousel from '../components/CardCarousel';
import MovementsList from '../components/MovementsList';

const HomePage = () => {
  const dispatch = useDispatch();
  const { cards, selectedCard, loading: cardsLoading, error: cardsError } = useSelector(
    (state) => state.cards
  );
  const { movements, loading: movementsLoading } = useSelector(
    (state) => state.movements
  );

  // Carica le carte al mount
  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  // Carica i movimenti quando cambia la carta selezionata
  useEffect(() => {
    if (selectedCard) {
      dispatch(fetchMovements(selectedCard.id));
    }
  }, [selectedCard, dispatch]);

  const handleSelectCard = (card) => {
    dispatch(selectCard(card));
  };

  if (cardsLoading && cards.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Titolo */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Le Tue Carte
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Seleziona una carta per visualizzare i movimenti
        </Typography>
      </Box>

      {/* Errore caricamento carte */}
      {cardsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {cardsError}
        </Alert>
      )}

      {/* Carosello Carte */}
      <Box sx={{ mb: 4 }}>
        <CardCarousel
          cards={cards}
          selectedCard={selectedCard}
          onSelectCard={handleSelectCard}
        />
      </Box>

      {/* Lista Movimenti */}
      {selectedCard && (
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
            Movimenti - {selectedCard.holder}
          </Typography>
          <MovementsList movements={movements} loading={movementsLoading} />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;

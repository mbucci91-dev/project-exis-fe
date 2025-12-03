import React, { useRef } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { formatPAN, getCardIcon } from '../utils/formatters';

const CardCarousel = ({ cards, selectedCard, onSelectCard }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // larghezza carta + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  if (!cards || cards.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Nessuna carta disponibile</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Pulsante Sinistra */}
      <IconButton
        onClick={() => scroll('left')}
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: 'white',
          boxShadow: 2,
          '&:hover': { backgroundColor: 'grey.100' },
        }}
      >
        <ChevronLeft />
      </IconButton>

      {/* Container Carte */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          px: 2,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            onClick={() => onSelectCard(card)}
            sx={{
              minWidth: 300,
              maxWidth: 300,
              height: 180,
              cursor: 'pointer',
              background: selectedCard?.id === card.id
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
              color: 'white',
              transition: 'all 0.3s ease',
              border: selectedCard?.id === card.id ? '3px solid #ffd700' : 'none',
              transform: selectedCard?.id === card.id ? 'scale(1.05)' : 'scale(1)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header con Circuito e Stato */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  {getCardIcon(card.circuit)}
                </Typography>
                {card.blocked && (
                  <Chip
                    label="BLOCCATA"
                    size="small"
                    color="error"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* PAN */}
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2, letterSpacing: 1 }}>
                {formatPAN(card.pan)}
              </Typography>

              {/* Footer con Nome e Scadenza */}
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Intestatario
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {card.holder}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Scadenza
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {card.exp_date}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pulsante Destra */}
      <IconButton
        onClick={() => scroll('right')}
        sx={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          backgroundColor: 'white',
          boxShadow: 2,
          '&:hover': { backgroundColor: 'grey.100' },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default CardCarousel;

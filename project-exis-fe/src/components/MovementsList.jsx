import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { formatAmount, formatDate } from '../utils/formatters';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const MovementsList = ({ movements, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Nessun movimento disponibile per questa carta
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight={600}>
          Movimenti Recenti
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {movements.length} {movements.length === 1 ? 'movimento' : 'movimenti'}
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {movements.map((movement, index) => {
          const isNegative = movement.amount < 0;
          return (
            <React.Fragment key={movement.id}>
              <ListItem
                sx={{
                  py: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                {/* Icona */}
                <Box
                  sx={{
                    mr: 2,
                    backgroundColor: isNegative ? 'error.light' : 'success.light',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isNegative ? (
                    <TrendingDownIcon sx={{ color: 'error.dark' }} />
                  ) : (
                    <TrendingUpIcon sx={{ color: 'success.dark' }} />
                  )}
                </Box>

                {/* Descrizione e Data */}
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={500}>
                      {movement.description}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(movement.date)}
                    </Typography>
                  }
                  sx={{ flex: 1 }}
                />

                {/* Importo */}
                <Box sx={{ textAlign: 'right', ml: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color={isNegative ? 'error.main' : 'success.main'}
                  >
                    {isNegative ? '-' : '+'} {formatAmount(Math.abs(movement.amount))}
                  </Typography>
                  <Chip
                    label={isNegative ? 'Uscita' : 'Entrata'}
                    size="small"
                    color={isNegative ? 'error' : 'success'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </ListItem>
              {index < movements.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default MovementsList;

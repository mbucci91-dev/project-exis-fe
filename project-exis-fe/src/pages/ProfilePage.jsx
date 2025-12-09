import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, blockCard, fetchCardDetails } from '../redux/slices/cardsSlice';
import userService from '../services/userService';
import { formatFullPAN, formatExpDate, getCardIcon } from '../utils/formatters';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { cards, selectedCard, cardDetails, loading } = useSelector((state) => state.cards);
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Carica i dati del profilo
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfileData(data);
      } catch (error) {
        setProfileError(error.response?.data?.message || 'Errore nel caricamento del profilo');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
    dispatch(fetchCards());
  }, [dispatch]);

  const handleShowCardDetails = async () => {
    if (!selectedCard) return;
    
    setActionLoading(true);
    try {
      await dispatch(fetchCardDetails(selectedCard.id)).unwrap();
      setOpenDetailsDialog(true);
    } catch (error) {
      setProfileError(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockCard = async () => {
    if (!selectedCard) return;

    setActionLoading(true);
    try {
      await dispatch(blockCard(selectedCard.id)).unwrap();
      setSuccessMessage('Carta bloccata con successo! (MOCK)');
      setOpenBlockDialog(false);
    } catch (error) {
      setProfileError(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
          Il Tuo Profilo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestisci i tuoi dati personali e le tue carte
        </Typography>
      </Box>

      {/* Messaggi */}
      {profileError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setProfileError(null)}>
          {profileError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Dati Utente */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountCircleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600}>
                Dati Personali
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Username
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {user?.username || profileData?.username || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {profileData?.email || user?.email || 'non disponibile'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ID Utente
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                #{user?.id || profileData?.id || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Gestione Carte */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CreditCardIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" fontWeight={600}>
                Gestione Carte
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {selectedCard ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Carta Selezionata
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: 'grey.100',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {getCardIcon(selectedCard.circuit)}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedCard.holder}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCard.pan_masked || `**** **** **** ${selectedCard.pan?.slice(-4) || ''}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Scad: {selectedCard.exp_date}
                    </Typography>
                    <Chip
                      label={selectedCard.status === 'active' ? 'ATTIVA' : selectedCard.status === 'blocked' ? 'BLOCCATA' : 'NON ATTIVA'}
                      color={selectedCard.status === 'active' ? 'success' : 'error'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={handleShowCardDetails}
                    disabled={actionLoading}
                    fullWidth
                  >
                    Mostra Dati Carta
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<BlockIcon />}
                    onClick={() => setOpenBlockDialog(true)}
                    disabled={actionLoading || selectedCard.status === 'blocked'}
                    fullWidth
                  >
                    {selectedCard.status === 'blocked' ? 'Carta Già Bloccata' : 'Blocca Carta'}
                  </Button>
                  <Alert severity="info" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    ⚠️ Funzionalità con dati MOCK (backend in sviluppo)
                  </Alert>
                </Box>
              </>
            ) : (
              <Alert severity="info">
                Seleziona una carta dalla home page per gestirla
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Riepilogo Carte */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Le Tue Carte
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : cards.length > 0 ? (
              <Grid container spacing={2}>
                {cards.map((card) => (
                  <Grid item xs={12} sm={6} md={4} key={card.id}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        backgroundColor: card.status === 'blocked' || card.status !== 'active' ? 'error.light' : 'white',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {getCardIcon(card.circuit)}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {card.holder}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.pan_masked || `**** **** **** ${card.pan?.slice(-4) || ''}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Scad. {card.exp_date}
                      </Typography>
                      <Chip 
                        label={card.status === 'active' ? 'ATTIVA' : card.status === 'blocked' ? 'BLOCCATA' : 'NON ATTIVA'} 
                        color={card.status === 'active' ? 'success' : 'error'} 
                        size="small" 
                        sx={{ mt: 1 }} 
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">Nessuna carta disponibile</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* TODO: Dialog da implementare quando il backend sarà pronto */}
      {/* Dialog Dettagli Carta */}
      {/* Dialog Dettagli Carta */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              Dettagli Carta
            </Typography>
            <Chip label="MOCK DATA" color="warning" size="small" />
          </Box>
        </DialogTitle>
        <DialogContent>
          {cardDetails ? (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Numero Carta (PAN)
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {formatFullPAN(cardDetails.pan)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Intestatario
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {cardDetails.holder}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Scadenza
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {formatExpDate(cardDetails.exp_date)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Circuito
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {cardDetails.circuit}
                </Typography>
              </Box>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Chiudi</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Conferma Blocco */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              Conferma Blocco Carta
            </Typography>
            <Chip label="MOCK DATA" color="warning" size="small" />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ Questa è una simulazione. Il backend non è ancora implementato.
          </Alert>
          <Typography>
            Sei sicuro di voler bloccare la carta <strong>{selectedCard?.holder}</strong>?
            Questa azione potrebbe non essere reversibile.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)} disabled={actionLoading}>
            Annulla
          </Button>
          <Button
            onClick={handleBlockCard}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Blocca Carta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;

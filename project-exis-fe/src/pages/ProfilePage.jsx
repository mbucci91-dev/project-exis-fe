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
import { fetchCards } from '../redux/slices/cardsSlice';
import userService from '../services/userService';
import cardService from '../services/cardService';
import challengeService from '../services/challengeService';
import { formatFullPAN, formatExpDate, getCardIcon } from '../utils/formatters';
import PinChallengeDialog from '../components/PinChallengeDialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BlockIcon from '@mui/icons-material/Block';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { cards, selectedCard, loading } = useSelector((state) => state.cards);
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  
  // Challenge states
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [challengeData, setChallengeData] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'details' | 'block'
  
  // Results states
  const [cardDetails, setCardDetails] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
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

  // Inizia il challenge per visualizzare i dettagli della carta
  const handleShowCardDetails = async () => {
    if (!selectedCard) return;
    
    try {
      setChallengeLoading(true);
      setProfileError(null);
      
      const challenge = await challengeService.requestChallenge();
      setChallengeData(challenge);
      setPendingAction('details');
      setShowPinDialog(true);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Errore nella richiesta di verifica');
    } finally {
      setChallengeLoading(false);
    }
  };

  // Inizia il challenge per bloccare la carta
  const handleBlockCardRequest = async () => {
    if (!selectedCard) return;
    
    try {
      setChallengeLoading(true);
      setProfileError(null);
      
      const challenge = await challengeService.requestChallenge();
      setChallengeData(challenge);
      setPendingAction('block');
      setShowPinDialog(true);
      setOpenBlockDialog(false);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Errore nella richiesta di verifica');
    } finally {
      setChallengeLoading(false);
    }
  };

  // Callback quando l'utente invia le cifre del PIN
  const handlePinSubmit = async (digits) => {
    if (!challengeData || !selectedCard) return;

    setChallengeLoading(true);
    setProfileError(null);

    const challengePayload = {
      digits,
      challenge_token: challengeData.challenge_token,
    };

    try {
      if (pendingAction === 'details') {
        // Richiedi dettagli carta
        const details = await cardService.getCardDetails(selectedCard.id, challengePayload);
        setCardDetails(details);
        setShowPinDialog(false);
        setOpenDetailsDialog(true);
      } else if (pendingAction === 'block') {
        // Blocca carta
        const result = await cardService.blockCard(selectedCard.id, challengePayload);
        setSuccessMessage(result.message || 'Carta bloccata con successo');
        setShowPinDialog(false);
        // Ricarica le carte per aggiornare lo stato
        await dispatch(fetchCards()).unwrap();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setProfileError('PIN non valido. Riprova.');
      } else {
        setProfileError(error.response?.data?.message || 'Errore durante l\'operazione');
      }
    } finally {
      setChallengeLoading(false);
      setChallengeData(null);
      setPendingAction(null);
    }
  };

  // Chiude il dialog PIN
  const handleClosePinDialog = () => {
    setShowPinDialog(false);
    setChallengeData(null);
    setPendingAction(null);
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
        <Grid size={{ xs: 12, md: 6 }}>
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
                Indirizzo
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {profileData?.address || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Telefono
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {profileData?.phone || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Data di Nascita
              </Typography>
              <Typography variant="h6" fontWeight={500}>
                {profileData?.dob || 'N/A'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Gestione Carte */}
        <Grid size={{ xs: 12, md: 6 }}>
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
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Scad: {selectedCard.exp_date}
                    </Typography>
                    <Chip
                      label={selectedCard.status === 'active' ? 'ATTIVA' : selectedCard.status === 'blocked' ? 'BLOCCATA' : 'NON ATTIVA'}
                      color={selectedCard.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={handleShowCardDetails}
                    disabled={challengeLoading}
                    fullWidth
                  >
                    {challengeLoading ? 'Caricamento...' : 'Mostra Dati Carta'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<BlockIcon />}
                    onClick={() => setOpenBlockDialog(true)}
                    disabled={challengeLoading || selectedCard.status === 'blocked'}
                    fullWidth
                  >
                    {selectedCard.status === 'blocked' ? 'Carta Già Bloccata' : 'Blocca Carta'}
                  </Button>
                  <Alert severity="info" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    🔒 Richiede verifica PIN per sicurezza
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
        <Grid size={{ xs: 12 }}>
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
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.id}>
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
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Scad. {card.exp_date}
                      </Typography>
                      <Chip 
                        label={card.status === 'active' ? 'ATTIVA' : card.status === 'blocked' ? 'BLOCCATA' : 'NON ATTIVA'} 
                        color={card.status === 'active' ? 'success' : 'error'} 
                        size="small"
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

      {/* Dialog Dettagli Carta */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
          Dettagli Carta
        </DialogTitle>
        <DialogContent>
          {cardDetails ? (
            <Box sx={{ pt: 2 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                🔓 Dati decifrati con successo
              </Alert>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Numero Carta (PAN)
                </Typography>
                <Typography variant="h6" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                  {cardDetails.decrypted_pan || formatFullPAN(cardDetails.pan)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  CVV
                </Typography>
                <Typography variant="h6" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                  {cardDetails.decrypted_cvv || cardDetails.cvv || '***'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Intestatario
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {selectedCard?.holder}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Scadenza
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {formatExpDate(selectedCard?.exp_date)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Circuito
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {selectedCard?.circuit}
                </Typography>
              </Box>
              
              <Alert severity="warning" sx={{ mt: 3 }}>
                ⚠️ Non condividere mai questi dati con nessuno
              </Alert>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDetailsDialog(false);
            setCardDetails(null);
          }}>
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Conferma Blocco */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Conferma Blocco Carta
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ Stai per bloccare definitivamente la carta. Questa azione potrebbe non essere reversibile.
          </Alert>
          <Typography>
            Vuoi procedere con il blocco della carta <strong>{selectedCard?.holder}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ti verrà richiesto di inserire alcune cifre del tuo PIN per confermare.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)} disabled={challengeLoading}>
            Annulla
          </Button>
          <Button
            onClick={handleBlockCardRequest}
            color="error"
            variant="contained"
            disabled={challengeLoading}
          >
            {challengeLoading ? <CircularProgress size={24} /> : 'Procedi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog PIN Challenge */}
      <PinChallengeDialog
        open={showPinDialog}
        onClose={handleClosePinDialog}
        onSubmit={handlePinSubmit}
        indicesToAsk={challengeData?.indices_to_ask || []}
        loading={challengeLoading}
        title={pendingAction === 'details' ? 'Verifica per Visualizzazione' : 'Verifica per Blocco'}
      />
    </Container>
  );
};

export default ProfilePage;

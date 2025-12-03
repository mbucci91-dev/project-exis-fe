// Formattazione del PAN (numero carta)
export const formatPAN = (pan) => {
  if (!pan) return '';
  // Maschera tutto tranne le ultime 4 cifre
  const masked = '**** **** **** ' + pan.slice(-4);
  return masked;
};

// Formattazione completa del PAN (per visualizzazione dettagli)
export const formatFullPAN = (pan) => {
  if (!pan) return '';
  return pan.match(/.{1,4}/g)?.join(' ') || pan;
};

// Formattazione della data di scadenza
export const formatExpDate = (expDate) => {
  if (!expDate) return '';
  return expDate;
};

// Formattazione dell'importo
export const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '€ 0,00';
  const formatted = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
  return formatted;
};

// Formattazione della data
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Formattazione del circuito carta
export const getCardIcon = (circuit) => {
  const circuits = {
    visa: '💳 Visa',
    mastercard: '💳 Mastercard',
    amex: '💳 American Express',
    maestro: '💳 Maestro',
  };
  return circuits[circuit?.toLowerCase()] || '💳 ' + circuit;
};

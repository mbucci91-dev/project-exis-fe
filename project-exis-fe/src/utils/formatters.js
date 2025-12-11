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

// Formattazione della data (dd/MM/YY - HH:mm)
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Se il formato è già "dd/mm/yyyy - HH:MM" dal backend, ritorna così com'è
  if (dateString.includes(' - ')) {
    return dateString;
  }
  
  // Altrimenti, prova a parsare e formattare
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

// Formattazione del circuito carta
export const getCardIcon = (circuit) => {
  if (!circuit) return '💳 Carta';
  
  const circuits = {
    visa: '💳 Visa',
    Visa: '💳 Visa',
    mastercard: '💳 Mastercard',
    Mastercard: '💳 Mastercard',
    amex: '💳 American Express',
    'American Express': '💳 American Express',
    maestro: '💳 Maestro',
    Maestro: '💳 Maestro',
  };
  
  const circuitLower = circuit.toLowerCase();
  return circuits[circuitLower] || circuits[circuit] || `💳 ${circuit}`;
};

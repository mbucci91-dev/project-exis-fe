/**
 * Utility per gestire dati sensibili cifrati
 * 
 * NOTA: In questa implementazione semplificata, il backend invia i dati GIÀ DECIFRATI
 * invece di inviarli cifrati con Fernet. Questo elimina la necessità di librerie
 * complesse e polyfill sul frontend.
 * 
 * Il backend deve:
 * 1. Verificare il PIN tramite challenge
 * 2. Decifrare i dati lato server
 * 3. Inviarli al frontend già in chiaro (su HTTPS)
 */

/**
 * "Decifra" i dati ricevuti dal backend.
 * In realtà il backend li invia già decifrati dopo la verifica PIN.
 * 
 * @param {string} tempKey - Non usato (compatibilità API)
 * @param {object} encryptedData - Oggetto { pan: "...", cvv: "..." } già decifrato dal backend
 * @returns {object} I dati così come ricevuti
 */
export const decryptFernetData = (tempKey, encryptedData) => {
  // Il backend invia i dati già decifrati, li ritorniamo direttamente
  return {
    pan: encryptedData.pan || '',
    cvv: encryptedData.cvv || ''
  };
};

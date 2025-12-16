/**
 * Utility per decifrare dati Fernet dal backend
 * 
 * Fernet usa:
 * - AES-128-CBC per cifratura
 * - HMAC-SHA256 per autenticazione
 * - Base64 URL-safe encoding
 * 
 * Formato token Fernet:
 * Version (1 byte) | Timestamp (8 bytes) | IV (16 bytes) | Ciphertext (variable) | HMAC (32 bytes)
 */

/**
 * Decifra un singolo campo cifrato con Fernet
 * 
 * @param {string} fernetToken - Token Fernet in formato base64 URL-safe
 * @param {string} base64Key - Chiave Fernet in base64 URL-safe (32 bytes)
 * @returns {Promise<string>} - Testo in chiaro
 */
async function decryptFernetToken(fernetToken, base64Key) {
  try {
    // 1. Decodifica base64 (standard o URL-safe)
    const tokenBytes = base64Decode(fernetToken);
    const keyBytes = base64Decode(base64Key);

    // 2. Estrai componenti del token Fernet
    const version = tokenBytes[0];
    
    if (version !== 0x80) {
      throw new Error('Versione Fernet non supportata: 0x' + version.toString(16));
    }

    // Struttura Fernet: Version (1) | Timestamp (8) | IV (16) | Ciphertext (var) | HMAC (32)
    const iv = tokenBytes.slice(9, 25);              // 16 bytes IV
    const ciphertext = tokenBytes.slice(25, -32);    // dati cifrati
    const receivedHmac = tokenBytes.slice(-32);      // 32 bytes HMAC

    // 3. Verifica HMAC (integrità)
    // In Fernet: primi 16 bytes = signing key, ultimi 16 bytes = encryption key
    const signingKey = keyBytes.slice(0, 16);        // PRIMA metà della chiave per HMAC
    const dataToSign = tokenBytes.slice(0, -32);     // Tutto tranne l'HMAC
    
    const hmacKey = await crypto.subtle.importKey(
      'raw',
      signingKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      hmacKey,
      receivedHmac,
      dataToSign
    );

    if (!isValid) {
      throw new Error('HMAC non valido - token corrotto o manomesso');
    }

    // 4. Decifra con AES-128-CBC
    const encryptionKey = keyBytes.slice(16, 32);    // SECONDA metà della chiave per AES
    
    const aesKey = await crypto.subtle.importKey(
      'raw',
      encryptionKey,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      aesKey,
      ciphertext
    );

    // 5. Rimuovi padding PKCS7 e converti in stringa
    const plaintext = removePKCS7Padding(new Uint8Array(decrypted));
    return new TextDecoder().decode(plaintext);

  } catch (error) {
    throw new Error('Impossibile decifrare i dati: ' + error.message);
  }
}

/**
 * Decodifica base64 (sia standard che URL-safe) in Uint8Array
 */
function base64Decode(str) {
  // Il backend invia base64 standard (con + / =)
  // ma supportiamo anche URL-safe (- _ senza =) per compatibilità
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Aggiungi padding se necessario (solo per URL-safe)
  while (base64.length % 4) {
    base64 += '=';
  }

  // Decodifica
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Rimuove padding PKCS7
 */
function removePKCS7Padding(data) {
  if (data.length === 0) {
    throw new Error('Dati vuoti');
  }
  
  const paddingLength = data[data.length - 1];
  
  // Valida padding length
  if (paddingLength < 1 || paddingLength > 16) {
    return data;
  }
  
  // Verifica che tutti i byte di padding siano corretti
  for (let i = data.length - paddingLength; i < data.length; i++) {
    if (data[i] !== paddingLength) {
      return data;
    }
  }
  
  return data.slice(0, data.length - paddingLength);
}

/**
 * Decifra i dati della carta ricevuti dal backend
 * 
 * @param {string} tempKey - Chiave temporanea Fernet in base64 URL-safe
 * @param {object} encryptedData - { pan: "token_fernet", cvv: "token_fernet" }
 * @returns {Promise<object>} - { pan: "4532...", cvv: "123" }
 */
export const decryptFernetData = async (tempKey, encryptedData) => {
  const [pan, cvv] = await Promise.all([
    decryptFernetToken(encryptedData.pan, tempKey),
    decryptFernetToken(encryptedData.cvv, tempKey)
  ]);

  return { pan, cvv };
};

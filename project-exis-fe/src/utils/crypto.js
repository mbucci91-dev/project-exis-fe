/**
 * Decifra un singolo campo cifrato con Fernet
 * 
 * @param {string} fernetToken - Token Fernet in formato base64 URL-safe
 * @param {string} base64Key - Chiave Fernet in base64 URL-safe (32 bytes)
 * @returns {Promise<string>} - Testo in chiaro
 */
async function decryptFernetToken(fernetToken, base64Key) {
  try {
    const tokenBytes = base64Decode(fernetToken);
    const keyBytes = base64Decode(base64Key);

    const version = tokenBytes[0];
    
    if (version !== 0x80) {
      throw new Error('Versione Fernet non supportata: 0x' + version.toString(16));
    }
    const iv = tokenBytes.slice(9, 25);          
    const ciphertext = tokenBytes.slice(25, -32);
    const receivedHmac = tokenBytes.slice(-32);

    const signingKey = keyBytes.slice(0, 16);
    const dataToSign = tokenBytes.slice(0, -32);
    
    const hmacKey = await crypto.subtle.importKey('raw', signingKey,{ name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify('HMAC', hmacKey, receivedHmac, dataToSign);

    if (!isValid) {
      throw new Error('HMAC non valido - token corrotto o manomesso');
    }

    const encryptionKey = keyBytes.slice(16, 32);
    
    const aesKey = await crypto.subtle.importKey('raw', encryptionKey, { name: 'AES-CBC' }, false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, aesKey, ciphertext);
    const plaintext = removePKCS7Padding(new Uint8Array(decrypted));
    return new TextDecoder().decode(plaintext);

  } catch (error) {
    throw new Error('Impossibile decifrare i dati: ' + error.message);
  }
}


function base64Decode(str) {
  
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  while (base64.length % 4) {
    base64 += '=';
  }

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


function removePKCS7Padding(data) {
  if (data.length === 0) {
    throw new Error('Dati vuoti');
  }
  
  const paddingLength = data[data.length - 1];
  
  if (paddingLength < 1 || paddingLength > 16) {
    return data;
  }
  
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

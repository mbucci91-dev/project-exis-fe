# Configurazione API - Exis Frontend

## Modifiche Implementate

Sono state apportate le seguenti modifiche per allineare il frontend alle API definite nello swagger:

### 1. **Variabili d'Ambiente**
- Creato `.env` e `.env.example` con `REACT_APP_API_BASE_URL=https://project-exis-be.onrender.com`
- Aggiornato `.gitignore` per escludere `.env` dal versioning

### 2. **Configurazione Axios** (`src/services/axiosConfig.js`)
- Aggiornato baseURL a: `https://project-exis-be.onrender.com/api/`
- Configurato Bearer Token per autenticazione JWT
- Aggiunti header Accept e gestione CORS

### 3. **Auth Service** (`src/services/authService.js`)
- Modificata funzione `login()` per gestire la struttura di risposta API:
  ```json
  {
    "message": "Success",
    "code": 200,
    "response": {
      "token": "JWT_TOKEN",
      "username": "mario",
      "status": "Active"
    }
  }
  ```

### 4. **Card Service** (`src/services/cardService.js`)
- **Endpoint /cards**: Aggiornato per estrarre dati da `response.data.response`
- **Endpoint /movements/{card_id}**: Modificato da `/cards/{cardId}/movements` a `/movements/{card_id}`
- **Campo circuit**: Ora supportato per Visa/Mastercard/etc
- **MOCK implementati per funzionalità future**:
  - `/cards/${cardId}/details` (getCardDetails) - **USA MOCK DATA**
  - `/cards/${cardId}/block` (blockCard) - **USA MOCK DATA**
  - Flag `USE_MOCK_DATA = true` - Imposta a `false` quando il backend sarà pronto

### 5. **User Service** (`src/services/userService.js`)
- **Endpoint /profile**: Aggiornato da `/user/profile` a `/profile`
- Gestione corretta di `response.data.response`
- Restituisce: id, username, email, phone, dob, address, status

### 6. **Formatters** (`src/utils/formatters.js`)
- **formatDate()**: Aggiornato per formato `dd/MM/YY - HH:mm`
- **getCardIcon()**: Gestisce correttamente i circuiti (Visa, Mastercard, etc) evitando `undefined`

### 7. **Redux Slices**
- **cardsSlice.js**: Thunk `fetchCardDetails` e `blockCard` funzionanti con MOCK data
- **movementsSlice.js**: Già conforme (usa endpoint `/movements/{card_id}`)

### 8. **Profile Page** (`src/pages/ProfilePage.jsx`)
- Pulsanti "Mostra Dati Carta" e "Blocca Carta" **completamente funzionanti con MOCK data**
- Badge visivi "MOCK DATA" per indicare l'uso di dati simulati
- Alert informativi per avvisare l'utente che i dati sono simulati
- Aggiornata visualizzazione carte con campi corretti dall'API:
  - `pan_masked` invece di `pan`
  - `status` invece di `blocked`
  - `exp_date` come da API
  - `circuit` per visualizzare Visa/Mastercard

### 9. **Branding**
- Nome applicazione cambiato da "CardManager" a **"Exis"** in tutta l'app
- Aggiornati: title, manifest, header, footer
- Email aggiornata: `info@exis.it`

## Sistema MOCK

### Come Funziona
Le funzionalità non ancora implementate nel backend utilizzano dati MOCK:

1. **getCardDetails()**: Restituisce dettagli completi di una carta (PAN, CVV, etc.)
## Endpoint Disponibili

### Autenticazione
- **POST /login**: Login utente (pubblico, senza JWT) ✅ **IMPLEMENTATO**

### Profilo Utente
- **GET /profile**: Dati profilo completo (email, telefono, indirizzo, etc) ✅ **IMPLEMENTATO**

### Carte
- **GET /cards**: Lista carte utente con circuito (richiede JWT) ✅ **IMPLEMENTATO**
- **POST /cards/{cardId}/details**: Dettagli carta con challenge PIN 🔶 **MOCK**
- **POST /cards/{cardId}/block**: Blocca carta con challenge PIN 🔶 **MOCK**

### Movimenti
- **GET /movements/{card_id}**: Movimenti carta (formato: dd/MM/YY - HH:mm) ✅ **IMPLEMENTATO**

### Sicurezza
- **POST /auth/challenge**: Genera challenge PIN (Step 1) 🔶 **DA IMPLEMENTARE**
- **GET /cards**: Lista carte utente (richiede JWT) ✅ **IMPLEMENTATO**
- **GET /cards/{cardId}/details**: Dettagli carta (PAN completo) 🔶 **MOCK**
- **POST /cards/{cardId}/block**: Blocca una carta 🔶 **MOCK**

### Movimenti
- **GET /movements/{card_id}**: Movimenti di una carta specifica (richiede JWT) ✅ **IMPLEMENTATO**
Tutte le risposte seguono questa struttura standard:

```json
{
  "message": "Success",
  "code": 200,
  "response": {
    // dati specifici dell'endpoint
  }
}
```

## Endpoint Disponibili

### Autenticazione
- **POST /login**: Login utente (pubblico, senza JWT)

### Carte
- **GET /cards**: Lista carte utente (richiede JWT)

### Movimenti
- **GET /movements/{card_id}**: Movimenti di una carta specifica (richiede JWT)

## Note di Sicurezza

- Il server usa HTTPS su `project-exis-be.onrender.com`
- Tutte le richieste (eccetto /login) richiedono Bearer Token JWT
- Il token viene salvato in localStorage e aggiunto automaticamente agli header

## Avvio del Progetto

1. Installare le dipendenze:
   ```bash
   npm install
   ```

2. Verificare/modificare il file `.env` se necessario:
   ```
   REACT_APP_API_BASE_URL=https://project-exis-be.onrender.com/api/
   ```

3. Avviare l'applicazione:
   ```bash
   npm start
   ```

## URL API

- **Produzione**: `https://project-exis-be.onrender.com/api/`
- **Locale (se disponibile)**: `https://127.0.0.1:5000/api`

Per cambiare l'URL delle API, modifica la variabile `REACT_APP_API_BASE_URL` nel file `.env`.

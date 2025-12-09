# Configurazione API - Project Exis Frontend

## Modifiche Implementate

Sono state apportate le seguenti modifiche per allineare il frontend alle API definite nello swagger:

### 1. **Variabili d'Ambiente**
- Creato `.env` e `.env.example` con `REACT_APP_API_BASE_URL=https://project-exis-be.onrender.com`
- Aggiornato `.gitignore` per escludere `.env` dal versioning

### 2. **Configurazione Axios** (`src/services/axiosConfig.js`)
- Aggiornato baseURL a: `https://project-exis-be.onrender.com`
- Configurato Bearer Token per autenticazione JWT

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
- **MOCK implementati per funzionalità future**:
  - `/cards/${cardId}/details` (getCardDetails) - **USA MOCK DATA**
  - `/cards/${cardId}/block` (blockCard) - **USA MOCK DATA**
  - Flag `USE_MOCK_DATA = true` - Imposta a `false` quando il backend sarà pronto

### 5. **Redux Slices**
- **cardsSlice.js**: Thunk `fetchCardDetails` e `blockCard` funzionanti con MOCK data
- **movementsSlice.js**: Già conforme (usa endpoint `/movements/{card_id}`)

### 6. **Profile Page** (`src/pages/ProfilePage.jsx`)
- Pulsanti "Mostra Dati Carta" e "Blocca Carta" **completamente funzionanti con MOCK data**
- Badge visivi "MOCK DATA" per indicare l'uso di dati simulati
- Alert informativi per avvisare l'utente che i dati sono simulati
- Aggiornata visualizzazione carte con campi corretti dall'API:
  - `pan_masked` invece di `pan`
  - `status` invece di `blocked`
  - `exp_date` come da API

## Sistema MOCK

### Come Funziona
Le funzionalità non ancora implementate nel backend utilizzano dati MOCK:

1. **getCardDetails()**: Restituisce dettagli completi di una carta (PAN, CVV, etc.)
2. **blockCard()**: Simula il blocco di una carta e aggiorna lo stato in Redux

### Attivazione/Disattivazione MOCK
Nel file `src/services/cardService.js`:
```javascript
// Imposta a false quando il backend sarà pronto
## Endpoint Disponibili

### Autenticazione
- **POST /login**: Login utente (pubblico, senza JWT) ✅ **IMPLEMENTATO**

### Carte
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
   REACT_APP_API_BASE_URL=https://project-exis-be.onrender.com
   ```

3. Avviare l'applicazione:
   ```bash
   npm start
   ```

## URL API

- **Produzione**: `https://project-exis-be.onrender.com`
- **Locale (se disponibile)**: `https://127.0.0.1:5000/api`

Per cambiare l'URL delle API, modifica la variabile `REACT_APP_API_BASE_URL` nel file `.env`.

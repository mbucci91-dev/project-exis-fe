# 💳 Exis - Sistema di Gestione Carte di Pagamento

Sistema completo per la gestione di carte di pagamento con autenticazione JWT, visualizzazione movimenti e gestione carte.

## 🚀 Stack Tecnologico

### Frontend
- **React 19.2.0** - Library UI
- **Redux Toolkit** - State Management
- **React Router** - Routing
- **Material-UI (MUI)** - UI Components
- **Axios** - HTTP Client
- **JWT-Decode** - Validazione Token
- **React-Toastify** - Notifiche Toast

### Backend (Richiesto)
- **Flask** - Framework Python
- **Flask-SQLAlchemy** - ORM
- **Flask-JWT-Extended** - Autenticazione JWT
- **Flask-CORS** - CORS handling

## 📁 Struttura del Progetto

```
test2/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/         # Componenti riutilizzabili
│   │   ├── CardCarousel.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── MovementsList.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Pagine dell'applicazione
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── ProfilePage.jsx
│   ├── redux/              # Redux Store e Slices
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── cardsSlice.js
│   │   │   ├── movementsSlice.js
│   │   │   └── uiSlice.js
│   │   └── store.js
│   ├── services/           # Servizi API
│   │   ├── authService.js
│   │   ├── axiosConfig.js
│   │   ├── cardService.js
│   │   └── userService.js
│   ├── utils/              # Utility functions
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.js              # Componente principale
│   ├── index.js            # Entry point
│   └── index.css
├── .env                    # Variabili d'ambiente
├── .env.example            # Template variabili d'ambiente
├── package.json
└── README.md
```

## 🔧 Installazione e Setup

### Prerequisiti
- Node.js >= 18.x
- NPM o Yarn
- Backend Flask configurato e in esecuzione

### 1. Installazione Dipendenze

```bash
npm install
```

### 2. Configurazione Variabili d'Ambiente

Il file `.env` è già presente nella root del progetto:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_NAME=Exis
```

**Nota**: Modifica `REACT_APP_API_BASE_URL` con l'URL del tuo backend Flask.

### 3. Avvio dell'Applicazione

```bash
npm start
```

L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)


## 🎨 Funzionalità Implementate

### ✅ Autenticazione
- Login con username/password
- Gestione JWT Token con localStorage
- Validazione token con jwt-decode
- Logout con pulizia stato
- Protected Routes per pagine private
- Redirect automatico se token scaduto

### ✅ Home Page
- **Carosello Carte**: Visualizzazione orizzontale scorrevole con pulsanti prev/next
- Selezione carta attiva con evidenziazione
- Lista movimenti dinamica
- Aggiornamento automatico movimenti al cambio carta
- Design responsive con animazioni smooth
- Indicatori visuali per carte bloccate

### ✅ Profilo Utente
- Visualizzazione dati personali (username, email, ID)
- Gestione carte:
  - Mostra dettagli completi carta in dialog
  - Blocco carta con dialog di conferma
- Riepilogo di tutte le carte dell'utente
- Badge per carte bloccate

### ✅ UI/UX
- **Material-UI Components**: Design moderno e professionale
- **Header**: Logo cliccabile, navigazione (Home, Profilo), user info, logout
- **Footer**: Contatti (email, telefono, indirizzo) e link utili
- **Responsive Design**: Ottimizzato per desktop, tablet e mobile
- **Loading States**: Spinner CircularProgress per operazioni async
- **Toast Notifications**: Feedback immediato (react-toastify)
- **Animazioni**: Transizioni smooth per carosello, hover effects, scale transforms
- **Color Coding**: Movimenti in entrata (verde) e uscita (rosso)

### ✅ State Management Redux
- **authSlice**: Login, logout, gestione JWT, user info
- **cardsSlice**: Lista carte, carta selezionata, dettagli, blocco
- **movementsSlice**: Lista movimenti per carta
- **uiSlice**: Loading globale, notifiche, modali

## 🔐 Sicurezza

- Token JWT salvato in localStorage
- Axios interceptor per aggiungere automaticamente Authorization header
- Redirect automatico a /login se token scaduto/invalido (401)
- Protected Routes per prevenire accesso non autorizzato
- Validazione client-side dei form (username min 3 char, password min 6 char)


## 🔑 Credenziali di Test

**Username**: `mario`  
**Password**: `test123`

## 📝 Note Importanti

1. **Backend Obbligatorio**: Il frontend richiede un backend Flask funzionante
2. **CORS**: Assicurati che il backend abbia CORS configurato
3. **JWT Secret**: Cambia la secret key in produzione
4. **Variabili d'Ambiente**: Non committare `.env` su Git (è in .gitignore)
5. **HTTPS**: Usa HTTPS in produzione per sicurezza
6. **Password**: In produzione, usa hash delle password (bcrypt)
7. **Database**: In produzione, usa PostgreSQL invece di SQLite



---

**Sviluppato con ❤️ usando React 19, Redux Toolkit e Material-UI**

### Tecnologie Utilizzate

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| React | 19.2.0 | UI Library |
| Redux Toolkit | Latest | State Management |
| React Router | Latest | Routing SPA |
| Material-UI | Latest | UI Components |
| Axios | Latest | HTTP Client |
| JWT Decode | Latest | Token Validation |
| React Toastify | Latest | Notifications |

### Struttura Redux

```
store
├── auth
│   ├── user
│   ├── token
│   ├── isAuthenticated
│   └── loading/error
├── cards
│   ├── cards[]
│   ├── selectedCard
│   ├── cardDetails
│   └── loading/error
├── movements
│   ├── movements[]
│   └── loading/error
└── ui
    ├── isLoading
    ├── notification
    └── modal
```

---

**Happy Coding! 🚀**

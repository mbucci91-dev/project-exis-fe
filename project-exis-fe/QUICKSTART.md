# 🚀 Quick Start Guide - CardManager

## Setup Completo in 5 Minuti

### 1️⃣ Setup Backend (Flask)

```bash
# Installa dipendenze Python
pip install -r requirements.txt

# Avvia il backend
python backend_example.py
```

Il backend sarà disponibile su `http://localhost:5000`
Credenziali di test: **username** / **password**

### 2️⃣ Setup Frontend (React)

```bash
# Installa dipendenze Node.js (già fatto se hai clonato il progetto)
npm install

# Avvia l'applicazione React
npm start
```

L'app sarà disponibile su `http://localhost:3000`

### 3️⃣ Test dell'Applicazione

1. **Login**: Vai su http://localhost:3000/login
   - Username: `username`
   - Password: `password`

2. **Home Page**: Visualizza le tue carte nel carosello
   - Scorri tra le carte (3 carte di esempio)
   - Clicca su una carta per vedere i movimenti

3. **Profilo**: Vai su http://localhost:3000/profilo
   - Visualizza dati utente
   - Mostra dettagli completi carta
   - Blocca una carta

## ✅ Checklist Setup

- [ ] Backend Flask avviato su porta 5000
- [ ] Frontend React avviato su porta 3000
- [ ] Login effettuato con successo
- [ ] Carte visualizzate nella home
- [ ] Movimenti caricati correttamente
- [ ] Profilo accessibile

## 📁 Struttura File Creati

```
test2/
├── backend_example.py          # Backend Flask completo
├── requirements.txt            # Dipendenze Python
├── .env                        # Config variabili ambiente
├── .env.example                # Template config
├── QUICKSTART.md              # Questa guida
├── README.md                   # Documentazione completa
├── package.json                # Dipendenze Node.js
├── src/
│   ├── components/             # 6 componenti UI
│   ├── pages/                  # 3 pagine (Login, Home, Profilo)
│   ├── redux/                  # Store + 4 slices
│   ├── services/               # 4 servizi API
│   ├── utils/                  # Formatters e validators
│   ├── App.js                  # Router principale
│   └── index.js                # Entry point
└── public/
```

## 🔧 Comandi Utili

### Frontend
```bash
npm start           # Avvia dev server
npm run build       # Build produzione
npm test            # Esegui test
```

### Backend
```bash
python backend_example.py    # Avvia server Flask
```

### Verifica Installazioni
```bash
node --version      # Deve essere >= 18.x
python --version    # Deve essere >= 3.8
npm --version       # Deve essere >= 8.x
```

## 🐛 Problemi Comuni

### Backend non parte
```bash
# Verifica che Flask sia installato
pip list | grep -i flask

# Reinstalla dipendenze
pip install -r requirements.txt
```

### Frontend non parte
```bash
# Pulisci e reinstalla
rm -rf node_modules package-lock.json
npm install
```

### Errore CORS
- Verifica che il backend abbia `flask-cors` installato
- Controlla che `REACT_APP_API_BASE_URL` in `.env` sia corretto

## 📊 Dati di Esempio

Il backend crea automaticamente:
- **1 Utente**: username/password
- **3 Carte**: Visa, Mastercard, American Express
- **12 Movimenti**: Distribuiti tra le carte

## 🎯 Funzionalità Testate

✅ Login con JWT  
✅ Carosello carte interattivo  
✅ Visualizzazione movimenti  
✅ Profilo utente  
✅ Blocco carta  
✅ Dettagli carta  
✅ Logout  
✅ Protected routes  
✅ Responsive design  
✅ Material-UI styling  

## 🔗 Link Utili

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health
- Login: http://localhost:3000/login
- Home: http://localhost:3000/home
- Profilo: http://localhost:3000/profilo

## 📞 Supporto

Se riscontri problemi, consulta il `README.md` completo per troubleshooting dettagliato.

---

**Happy Coding! 🚀**

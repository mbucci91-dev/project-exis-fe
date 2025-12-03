# 💳 CardManager - Sistema di Gestione Carte di Pagamento

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
REACT_APP_NAME=Card Management System
```

**Nota**: Modifica `REACT_APP_API_BASE_URL` con l'URL del tuo backend Flask.

### 3. Avvio dell'Applicazione

```bash
npm start
```

L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)

### 4. Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno generati nella cartella `build/`.

### 5. Test

```bash
npm test
```

Esegue i test in modalità interattiva.

## 📡 API Endpoints Richiesti dal Backend

Il frontend si aspetta i seguenti endpoint dal backend Flask:

### Autenticazione
- `POST /api/login` - Login utente
  ```json
  Request: { "username": "string", "password": "string" }
  Response: { "token": "JWT_TOKEN" }
  ```

### Utente
- `GET /api/user/profile` - Ottieni profilo utente (JWT required)
  ```json
  Response: { "id": 1, "username": "string", "email": "string" }
  ```

### Carte
- `GET /api/cards` - Ottieni tutte le carte dell'utente (JWT required)
  ```json
  Response: [
    {
      "id": 1,
      "pan": "1234567890123456",
      "holder": "MARIO ROSSI",
      "exp_date": "12/25",
      "circuit": "Visa",
      "blocked": false
    }
  ]
  ```

- `GET /api/cards/:id/details` - Dettagli completi carta (JWT required)
  ```json
  Response: {
    "id": 1,
    "pan": "1234567890123456",
    "holder": "MARIO ROSSI",
    "exp_date": "12/25",
    "circuit": "Visa"
  }
  ```

- `POST /api/cards/:id/block` - Blocca una carta (JWT required)
  ```json
  Response: { "message": "Carta bloccata con successo", "blocked": true }
  ```

- `GET /api/cards/:id/movements` - Movimenti di una carta (JWT required)
  ```json
  Response: [
    {
      "id": 1,
      "date": "2025-12-01T10:30:00",
      "amount": -50.00,
      "description": "Pagamento Amazon",
      "card_id": 1
    }
  ]
  ```

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

## 🛠️ Esempio Backend Flask Completo

Crea un file `backend/app.py` con il seguente codice:

```python
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cards.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# ===== MODELS =====

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120))
    cards = db.relationship('Card', backref='owner', lazy=True)

class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pan = db.Column(db.String(16), nullable=False)
    holder = db.Column(db.String(50), nullable=False)
    exp_date = db.Column(db.String(5), nullable=False)
    circuit = db.Column(db.String(50), nullable=False)
    blocked = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movements = db.relationship('Movement', backref='card', lazy=True)

class Movement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id'), nullable=False)

# ===== ROUTES =====

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        token = create_access_token(identity={
            'id': user.id,
            'username': user.username
        })
        return jsonify({'token': token}), 200
    
    return jsonify({'message': 'Credenziali non valide'}), 401

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email or 'user@example.com'
    })

@app.route('/api/cards', methods=['GET'])
@jwt_required()
def get_cards():
    current_user = get_jwt_identity()
    cards = Card.query.filter_by(user_id=current_user['id']).all()
    return jsonify([{
        'id': c.id,
        'pan': c.pan,
        'holder': c.holder,
        'exp_date': c.exp_date,
        'circuit': c.circuit,
        'blocked': c.blocked
    } for c in cards])

@app.route('/api/cards/<int:card_id>/details', methods=['GET'])
@jwt_required()
def get_card_details(card_id):
    current_user = get_jwt_identity()
    card = Card.query.filter_by(id=card_id, user_id=current_user['id']).first()
    
    if not card:
        return jsonify({'message': 'Carta non trovata'}), 404
    
    return jsonify({
        'id': card.id,
        'pan': card.pan,
        'holder': card.holder,
        'exp_date': card.exp_date,
        'circuit': card.circuit,
        'blocked': card.blocked
    })

@app.route('/api/cards/<int:card_id>/block', methods=['POST'])
@jwt_required()
def block_card(card_id):
    current_user = get_jwt_identity()
    card = Card.query.filter_by(id=card_id, user_id=current_user['id']).first()
    
    if not card:
        return jsonify({'message': 'Carta non trovata'}), 404
    
    card.blocked = True
    db.session.commit()
    
    return jsonify({
        'message': 'Carta bloccata con successo',
        'blocked': True
    })

@app.route('/api/cards/<int:card_id>/movements', methods=['GET'])
@jwt_required()
def get_card_movements(card_id):
    current_user = get_jwt_identity()
    card = Card.query.filter_by(id=card_id, user_id=current_user['id']).first()
    
    if not card:
        return jsonify({'message': 'Carta non trovata'}), 404
    
    movements = Movement.query.filter_by(card_id=card_id).order_by(Movement.date.desc()).all()
    
    return jsonify([{
        'id': m.id,
        'date': m.date.isoformat(),
        'amount': m.amount,
        'description': m.description,
        'card_id': m.card_id
    } for m in movements])

# ===== INIT DATABASE =====

@app.before_first_request
def create_tables():
    db.create_all()
    
    # Crea dati di esempio se il DB è vuoto
    if User.query.count() == 0:
        # User di test
        user = User(username='username', password='password', email='user@example.com')
        db.session.add(user)
        db.session.commit()
        
        # Carte di test
        card1 = Card(
            pan='4532123456789012',
            holder='MARIO ROSSI',
            exp_date='12/25',
            circuit='Visa',
            user_id=user.id
        )
        card2 = Card(
            pan='5425233430109903',
            holder='MARIO ROSSI',
            exp_date='03/26',
            circuit='Mastercard',
            user_id=user.id
        )
        db.session.add(card1)
        db.session.add(card2)
        db.session.commit()
        
        # Movimenti di test
        movements = [
            Movement(date=datetime(2025, 12, 1, 10, 30), amount=-50.00, description='Pagamento Amazon', card_id=card1.id),
            Movement(date=datetime(2025, 11, 28, 15, 20), amount=-120.50, description='Supermercato Esselunga', card_id=card1.id),
            Movement(date=datetime(2025, 11, 25, 9, 15), amount=1500.00, description='Accredito Stipendio', card_id=card1.id),
            Movement(date=datetime(2025, 11, 20, 18, 45), amount=-35.00, description='Ristorante La Piazzetta', card_id=card1.id),
            Movement(date=datetime(2025, 12, 2, 11, 0), amount=-25.00, description='Carburante Q8', card_id=card2.id),
            Movement(date=datetime(2025, 11, 30, 14, 30), amount=-89.99, description='Netflix Abbonamento', card_id=card2.id),
        ]
        for mov in movements:
            db.session.add(mov)
        db.session.commit()
        
        print("✅ Database inizializzato con dati di esempio")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Crea dati di esempio se il DB è vuoto
        if User.query.count() == 0:
            user = User(username='username', password='password', email='user@example.com')
            db.session.add(user)
            db.session.commit()
            
            card1 = Card(pan='4532123456789012', holder='MARIO ROSSI', exp_date='12/25', circuit='Visa', user_id=user.id)
            card2 = Card(pan='5425233430109903', holder='MARIO ROSSI', exp_date='03/26', circuit='Mastercard', user_id=user.id)
            db.session.add(card1)
            db.session.add(card2)
            db.session.commit()
            
            movements = [
                Movement(date=datetime(2025, 12, 1, 10, 30), amount=-50.00, description='Pagamento Amazon', card_id=card1.id),
                Movement(date=datetime(2025, 11, 28, 15, 20), amount=-120.50, description='Supermercato Esselunga', card_id=card1.id),
                Movement(date=datetime(2025, 11, 25, 9, 15), amount=1500.00, description='Accredito Stipendio', card_id=card1.id),
                Movement(date=datetime(2025, 11, 20, 18, 45), amount=-35.00, description='Ristorante La Piazzetta', card_id=card1.id),
                Movement(date=datetime(2025, 12, 2, 11, 0), amount=-25.00, description='Carburante Q8', card_id=card2.id),
                Movement(date=datetime(2025, 11, 30, 14, 30), amount=-89.99, description='Netflix Abbonamento', card_id=card2.id),
            ]
            for mov in movements:
                db.session.add(mov)
            db.session.commit()
            
            print("✅ Database inizializzato con dati di esempio")
    
    app.run(debug=True, port=5000)
```

### Setup Backend

```bash
# Installa dipendenze Python
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors

# Avvia il backend
python app.py
```

Il backend sarà disponibile su `http://localhost:5000`

## 📦 Deploy

### Deploy Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Deploy Frontend (Netlify)
1. Collega repository GitHub
2. Build command: `npm run build`
3. Publish directory: `build`
4. Aggiungi variabile d'ambiente `REACT_APP_API_BASE_URL`

### Deploy Backend (Heroku/Railway)
Configura il backend per deploy su Heroku o Railway con PostgreSQL

## 🐛 Troubleshooting

### Errore CORS
- Verifica che Flask-CORS sia installato: `pip install flask-cors`
- Aggiungi `CORS(app)` nel file Flask
- In sviluppo, CORS(app) permette tutte le origini

### Token non valido / 401 Unauthorized
- Controlla che il backend restituisca un JWT valido
- Verifica che la secret key JWT sia configurata
- Controlla che l'header Authorization sia: `Bearer TOKEN`

### Carte non visualizzate
- Verifica che l'endpoint `/api/cards` restituisca dati
- Controlla la console browser (F12) per errori API
- Verifica che il backend sia in esecuzione su porta 5000
- Controlla che REACT_APP_API_BASE_URL sia corretto in `.env`

### Movimenti non caricati
- Verifica che la carta selezionata abbia movimenti nel DB
- Controlla che l'endpoint `/api/cards/:id/movements` funzioni
- Verifica nella console Redux DevTools lo stato

### Build fallito
- Elimina `node_modules` e reinstalla: `rm -rf node_modules && npm install`
- Pulisci cache: `npm cache clean --force`
- Verifica versione Node.js: `node --version` (>= 18.x)

## 🔑 Credenziali di Test

**Username**: `username`  
**Password**: `password`

## 📝 Note Importanti

1. **Backend Obbligatorio**: Il frontend richiede un backend Flask funzionante
2. **CORS**: Assicurati che il backend abbia CORS configurato
3. **JWT Secret**: Cambia la secret key in produzione
4. **Variabili d'Ambiente**: Non committare `.env` su Git (è in .gitignore)
5. **HTTPS**: Usa HTTPS in produzione per sicurezza
6. **Password**: In produzione, usa hash delle password (bcrypt)
7. **Database**: In produzione, usa PostgreSQL invece di SQLite

## 🎯 Prossimi Sviluppi

- [ ] Hash password con bcrypt
- [ ] Reset password via email
- [ ] Registrazione nuovi utenti
- [ ] Dashboard con statistiche spese
- [ ] Export movimenti PDF/CSV
- [ ] Notifiche push per movimenti
- [ ] Multi-language (i18n)
- [ ] Dark mode
- [ ] Unit test completi
- [ ] E2E test con Cypress

## 📞 Supporto

Per problemi o domande:
- Email: info@cardmanager.it
- Tel: +39 02 1234 5678
- Indirizzo: Milano, Italia

## 👨‍💻 Autore

Progetto privato sviluppato per gestione carte di pagamento personali.

## 📄 Licenza

Progetto privato - Tutti i diritti riservati

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

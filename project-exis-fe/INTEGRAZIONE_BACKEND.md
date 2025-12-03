# 🔧 Integrazione Backend Esistente

Se hai già un backend Flask con i modelli User, Card e Movement, segui queste istruzioni per integrarlo con il frontend.

## 📋 Endpoint Richiesti

Il frontend React si aspetta questi endpoint esatti. Assicurati che il tuo backend li implementi.

### 1. Login (POST /api/login)

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Credenziali non valide"
}
```

**Implementazione Flask:**
```python
from flask_jwt_extended import create_access_token

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:  # Usa bcrypt in produzione!
        token = create_access_token(identity={
            'id': user.id,
            'username': user.username
        })
        return jsonify({'token': token}), 200
    
    return jsonify({'message': 'Credenziali non valide'}), 401
```

---

### 2. User Profile (GET /api/user/profile) [JWT Required]

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "mario_rossi",
  "email": "mario@example.com"
}
```

**Implementazione Flask:**
```python
from flask_jwt_extended import jwt_required, get_jwt_identity

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
```

---

### 3. Get Cards (GET /api/cards) [JWT Required]

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "pan": "4532123456789012",
    "holder": "MARIO ROSSI",
    "exp_date": "12/25",
    "circuit": "Visa",
    "blocked": false
  },
  {
    "id": 2,
    "pan": "5425233430109903",
    "holder": "MARIO ROSSI",
    "exp_date": "03/26",
    "circuit": "Mastercard",
    "blocked": false
  }
]
```

**Implementazione Flask:**
```python
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
        'blocked': getattr(c, 'blocked', False)  # Se non hai il campo blocked
    } for c in cards])
```

**⚠️ IMPORTANTE:** Se il tuo modello `Card` non ha il campo `blocked`, aggiungilo:

```python
class Card(db.Model):
    # ... campi esistenti ...
    blocked = db.Column(db.Boolean, default=False)
```

Poi esegui la migrazione:
```bash
# Con Flask-Migrate
flask db migrate -m "Add blocked field to Card"
flask db upgrade

# Oppure ricrea il DB (ATTENZIONE: perdi i dati!)
db.drop_all()
db.create_all()
```

---

### 4. Card Details (GET /api/cards/:id/details) [JWT Required]

**Response (200 OK):**
```json
{
  "id": 1,
  "pan": "4532123456789012",
  "holder": "MARIO ROSSI",
  "exp_date": "12/25",
  "circuit": "Visa",
  "blocked": false
}
```

**Response (404 Not Found):**
```json
{
  "message": "Carta non trovata"
}
```

**Implementazione Flask:**
```python
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
        'blocked': getattr(card, 'blocked', False)
    })
```

---

### 5. Block Card (POST /api/cards/:id/block) [JWT Required]

**Response (200 OK):**
```json
{
  "message": "Carta bloccata con successo",
  "blocked": true
}
```

**Response (404 Not Found):**
```json
{
  "message": "Carta non trovata"
}
```

**Implementazione Flask:**
```python
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
```

---

### 6. Card Movements (GET /api/cards/:id/movements) [JWT Required]

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "date": "2025-12-01T10:30:00",
    "amount": -50.00,
    "description": "Pagamento Amazon",
    "card_id": 1
  },
  {
    "id": 2,
    "date": "2025-11-28T15:20:00",
    "amount": -120.50,
    "description": "Supermercato Esselunga",
    "card_id": 1
  },
  {
    "id": 3,
    "date": "2025-11-25T09:15:00",
    "amount": 1500.00,
    "description": "Accredito Stipendio",
    "card_id": 1
  }
]
```

**Implementazione Flask:**
```python
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
        'date': m.date.isoformat(),  # Importante: formato ISO
        'amount': m.amount,
        'description': m.description,
        'card_id': m.card_id
    } for m in movements])
```

---

## 🔧 Configurazione Flask Necessaria

### 1. Installa Dipendenze

```bash
pip install flask-jwt-extended flask-cors
```

### 2. Configura Flask App

```python
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)

# Configurazione JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Inizializza JWT
jwt = JWTManager(app)

# Abilita CORS
CORS(app)

# ... resto del codice ...
```

### 3. Modifica URL Base (se necessario)

Se il tuo backend non usa `/api` come prefisso, hai due opzioni:

**Opzione A:** Modifica il frontend (file `.env`):
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

**Opzione B:** Aggiungi prefisso `/api` al backend:
```python
from flask import Blueprint

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/login', methods=['POST'])
def login():
    # ...

@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # ...

# Registra il blueprint
app.register_blueprint(api)
```

---

## ✅ Checklist Integrazione

- [ ] Flask-JWT-Extended installato e configurato
- [ ] Flask-CORS installato e abilitato
- [ ] Campo `blocked` aggiunto al modello `Card`
- [ ] Endpoint `/api/login` implementato
- [ ] Endpoint `/api/user/profile` implementato
- [ ] Endpoint `/api/cards` implementato
- [ ] Endpoint `/api/cards/:id/details` implementato
- [ ] Endpoint `/api/cards/:id/block` implementato
- [ ] Endpoint `/api/cards/:id/movements` implementato
- [ ] Token JWT include `id` e `username` nel payload
- [ ] Date formattate in ISO 8601 (`.isoformat()`)
- [ ] CORS abilitato per `http://localhost:3000`

---

## 🧪 Test Endpoints

Puoi testare gli endpoint con curl:

### Test Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"username","password":"password"}'
```

### Test Get Cards
```bash
TOKEN="<il_tuo_token>"
curl -X GET http://localhost:5000/api/cards \
  -H "Authorization: Bearer $TOKEN"
```

### Test Block Card
```bash
TOKEN="<il_tuo_token>"
curl -X POST http://localhost:5000/api/cards/1/block \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Errore: "Working outside of application context"
```python
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
```

### Errore CORS
Assicurati di aver installato e abilitato CORS:
```python
from flask_cors import CORS
CORS(app)
```

### Token non valido
Verifica che il payload del token includa `id` e `username`:
```python
token = create_access_token(identity={
    'id': user.id,
    'username': user.username
})
```

### Movimenti non visualizzati
Controlla che la data sia in formato ISO:
```python
'date': m.date.isoformat()  # Non solo str(m.date)
```

---

## 📚 Documentazione di Riferimento

- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)

---

## 💡 Suggerimenti

1. **In produzione**, usa hash per le password:
   ```python
   from werkzeug.security import generate_password_hash, check_password_hash
   
   # Durante registrazione
   user.password = generate_password_hash(password)
   
   # Durante login
   if check_password_hash(user.password, password):
       # Login valido
   ```

2. **PostgreSQL in produzione** invece di SQLite:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/dbname'
   ```

3. **Variabili d'ambiente** per secret keys:
   ```python
   import os
   app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
   ```

---

**Buona integrazione! 🚀**

"""
Backend Flask per CardManager
Sistema di gestione carte di pagamento con JWT Authentication

Requisiti:
pip install flask flask-sqlalchemy flask-jwt-extended flask-cors

Avvio:
python backend_example.py
"""

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
    password = db.Column(db.String(120), nullable=False)  # In produzione usare bcrypt!
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
    """Autenticazione utente e generazione JWT token"""
    username = request.json.get('username')
    password = request.json.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username e password sono obbligatori'}), 400
    
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
    """Ottieni profilo utente autenticato"""
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    
    if not user:
        return jsonify({'message': 'Utente non trovato'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email or 'user@example.com'
    })

@app.route('/api/cards', methods=['GET'])
@jwt_required()
def get_cards():
    """Ottieni tutte le carte dell'utente autenticato"""
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
    """Ottieni dettagli completi di una carta specifica"""
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
    """Blocca una carta"""
    current_user = get_jwt_identity()
    card = Card.query.filter_by(id=card_id, user_id=current_user['id']).first()
    
    if not card:
        return jsonify({'message': 'Carta non trovata'}), 404
    
    if card.blocked:
        return jsonify({'message': 'La carta è già bloccata'}), 400
    
    card.blocked = True
    db.session.commit()
    
    return jsonify({
        'message': 'Carta bloccata con successo',
        'blocked': True
    })

@app.route('/api/cards/<int:card_id>/movements', methods=['GET'])
@jwt_required()
def get_card_movements(card_id):
    """Ottieni tutti i movimenti di una carta specifica"""
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

# ===== UTILITY ROUTES =====

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint per verificare lo stato del server"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend Flask CardManager operativo',
        'timestamp': datetime.utcnow().isoformat()
    })

# ===== INIT DATABASE E DATI DEMO =====

def init_database():
    """Inizializza il database con dati di esempio"""
    db.create_all()
    
    # Verifica se il DB è già popolato
    if User.query.count() > 0:
        print("✅ Database già inizializzato")
        return
    
    print("🔄 Inizializzazione database...")
    
    # User di test
    user = User(
        username='username',
        password='password',  # In produzione usare bcrypt.hashpw()
        email='user@example.com'
    )
    db.session.add(user)
    db.session.commit()
    
    # Carte di test
    card1 = Card(
        pan='4532123456789012',
        holder='MARIO ROSSI',
        exp_date='12/25',
        circuit='Visa',
        blocked=False,
        user_id=user.id
    )
    card2 = Card(
        pan='5425233430109903',
        holder='MARIO ROSSI',
        exp_date='03/26',
        circuit='Mastercard',
        blocked=False,
        user_id=user.id
    )
    card3 = Card(
        pan='378282246310005',
        holder='MARIO ROSSI',
        exp_date='09/27',
        circuit='American Express',
        blocked=False,
        user_id=user.id
    )
    
    db.session.add_all([card1, card2, card3])
    db.session.commit()
    
    # Movimenti di test per card1 (Visa)
    movements_card1 = [
        Movement(date=datetime(2025, 12, 3, 10, 30), amount=-50.00, description='Pagamento Amazon', card_id=card1.id),
        Movement(date=datetime(2025, 12, 2, 15, 20), amount=-120.50, description='Supermercato Esselunga', card_id=card1.id),
        Movement(date=datetime(2025, 12, 1, 9, 15), amount=1500.00, description='Accredito Stipendio', card_id=card1.id),
        Movement(date=datetime(2025, 11, 30, 18, 45), amount=-35.00, description='Ristorante La Piazzetta', card_id=card1.id),
        Movement(date=datetime(2025, 11, 28, 14, 10), amount=-89.99, description='Abbonamento Spotify', card_id=card1.id),
        Movement(date=datetime(2025, 11, 25, 11, 0), amount=-250.00, description='Acquisto MediaWorld', card_id=card1.id),
    ]
    
    # Movimenti di test per card2 (Mastercard)
    movements_card2 = [
        Movement(date=datetime(2025, 12, 3, 11, 0), amount=-25.00, description='Carburante Q8', card_id=card2.id),
        Movement(date=datetime(2025, 12, 1, 14, 30), amount=-89.99, description='Netflix Abbonamento', card_id=card2.id),
        Movement(date=datetime(2025, 11, 29, 16, 45), amount=-42.50, description='Farmacia', card_id=card2.id),
        Movement(date=datetime(2025, 11, 27, 10, 20), amount=500.00, description='Bonifico Ricevuto', card_id=card2.id),
    ]
    
    # Movimenti di test per card3 (AmEx)
    movements_card3 = [
        Movement(date=datetime(2025, 12, 2, 19, 30), amount=-180.00, description='Cena Ristorante', card_id=card3.id),
        Movement(date=datetime(2025, 11, 30, 13, 15), amount=-350.00, description='Volo Ryanair', card_id=card3.id),
    ]
    
    for mov in movements_card1 + movements_card2 + movements_card3:
        db.session.add(mov)
    
    db.session.commit()
    
    print("✅ Database inizializzato con successo!")
    print(f"📊 Creati: 1 utente, 3 carte, {len(movements_card1 + movements_card2 + movements_card3)} movimenti")
    print("\n🔑 Credenziali di accesso:")
    print("   Username: username")
    print("   Password: password")

# ===== MAIN =====

if __name__ == '__main__':
    with app.app_context():
        init_database()
    
    print("\n" + "="*60)
    print("🚀 Backend Flask CardManager avviato!")
    print("="*60)
    print(f"📡 Server in ascolto su: http://localhost:5000")
    print(f"🏥 Health check: http://localhost:5000/api/health")
    print(f"📚 API Base URL: http://localhost:5000/api")
    print("="*60 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')

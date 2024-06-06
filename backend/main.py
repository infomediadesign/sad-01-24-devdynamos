from flask import Flask, request, jsonify
import bcrypt, jwt, datetime, re
from flasgger import Swagger
from flask_cors import CORS
from config import Config
from functools import wraps
from calories_tracker import init_calories_routes
from workouts import init_workouts_routes
from progressTracking import init_progress_routes
from dashboard import init_dashboard_routes
from admin import init_admin_routes
from models import User, Session
# from mongoengine import Document, StringField, EmailField, IntField, DateTimeField, ListField, ReferenceField

app = Flask(__name__)
app.config.from_object(Config)

# class User(Document):
#     username = StringField(required=True, unique=True)
#     password = StringField(required=True)
#     email = EmailField(required=True, unique=True)
#     age = IntField(required=True)
#     created_at = DateTimeField(default=datetime.datetime.utcnow)
#     hasRole = StringField(default='default')

#     meta = {'collection': 'users'}

# class Session(Document):
#     username = StringField(required=True, unique=True)
#     tokens = ListField(StringField())
    
#     meta = {'collection': 'sessions'}

# mongo = PyMongo(app)
# users_collection = mongo.db.users
# sessions_collection = mongo.db.sessions

# init_calories_routes(app, mongo)
init_workouts_routes(app)
# init_progress_routes(app, mongo)
# init_dashboard_routes(app, mongo)
# init_admin_routes(app, mongo)

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Fitness Tracking System",
        "description": "API to get access to features of Application.",
        "version": "1.0.0"
    },
    "host": "localhost:5000",  
    "basePath": "/",
    "schemes": [
        "http",
        "https"
    ],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Enter 'Bearer' [space] and then your token in the text input below.\n\nExample: 'Bearer 12345abcdef'"
        }
    },
    "security": [
        {
            "Bearer": []
        }
    ]
}

swagger = Swagger(app, template=swagger_template)

CORS(app)  

@app.route('/registration', methods=['POST'])
def create_user():
    data = request.get_json()
    username, password, email, age = data.get('username'), data.get('password'), data.get('email'), data.get('age')
    if not username or not password or not email or age is None:
        return jsonify({"error": "Username, password, email, and age are required"}), 400

    if int(age) < 18:
        return jsonify({"error": "You must be 18 or older to register"}), 400

    if len(password) < 8 or not re.search("[0-9]", password) or not re.search("[!@#$%^&*]", password):
        return jsonify({"error": "Password must be at least 8 characters long and contain at least one special character and one number"}), 400

    existing_user = User.objects(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    existing_email = User.objects(email=email).first()
    if existing_email:
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_data = User(username=username, password=hashed_password.decode('utf-8'), email=email, age=age)
    user_data.save()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.objects(username=username).first()
    if not user:
        return jsonify({"error": "Invalid username or password"}), 400

    if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        token = jwt.encode({'username': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10), "sub": "fitnessTrackingSystem", "hasRole" : user.hasRole}, app.config['JWT_SECRET_KEY'], algorithm='HS256')

        session = Session.objects(username=username).first()
        if session:
            session.tokens.append(token)
            session.save()
        else:
            session_data = Session(username=username, tokens=[token])
            session_data.save()
        return jsonify({"jwt_token": token}), 200

    else:
        return jsonify({"error": "Invalid username or password"}), 400

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            session = Session.objects(username=data['username']).first()
            if not session or token not in session.tokens:
                return jsonify({'message': 'Token is invalid '}), 401
            request.user = data['username']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)

    return decorated

@app.route('/logout', methods=['POST'])
@token_required
def logout():
    token = request.headers['Authorization'].split(" ")[1]
    try:
        session = Session.objects(username=request.user).first()
        if session:
            session.delete()
            return jsonify({"message": "User logged out successfully"}), 200
        else:
            return jsonify({"error": "Session not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
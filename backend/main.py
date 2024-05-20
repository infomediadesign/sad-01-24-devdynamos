from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt, jwt, datetime
from flasgger import Swagger
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

mongo = PyMongo(app)
users_collection = mongo.db.users

swagger = Swagger(app)
CORS(app)  # Enable CORS for all routes

@app.route('/registration', methods=['POST'])
def create_user():
    """Register a new user.
    ---
    parameters:
      - name: username
        in: formData
        type: string
        required: true
        description: Username for registration.
      - name: password
        in: formData
        type: string
        required: true
        description: Password for registration.
      - name: email
        in: formData
        type: string
        required: true
        description: Email for registration.
      - name: age
        in: formData
        type: integer
        required: true
        description: Age for registration.
    responses:
      201:
        description: User created successfully.
      400:
        description: Error message if registration fails.
    """
    data = request.get_json()
    username, password, email, age = data.get('username'), data.get('password'), data.get('email'), data.get('age')
    if not username or not password or not email or age is None:
        return jsonify({"error": "Username, password, email, and age are required"}), 400
    existing_user = users_collection.find_one({'username': username})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    existing_email = users_collection.find_one({'email': email})
    if existing_email:
        return jsonify({"error": "Email already exists"}), 400
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_data = {'username': username, 'password': hashed_password, 'email': email, 'age': age, 'created_at': datetime.datetime.utcnow()}
    users_collection.insert_one(user_data)
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    """Log in to the system.
    ---
    parameters:
      - name: username
        in: formData
        type: string
        required: true
        description: Username for login.
      - name: password
        in: formData
        type: string
        required: true
        description: Password for login.
    responses:
      200:
        description: JWT token generated successfully.
      400:
        description: Error message if login fails.
    """
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    user = users_collection.find_one({'username': username})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 400
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode({'user_id': str(user['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 400

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import bcrypt
import jwt  # This should be the PyJWT library
import datetime
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Initialize PyMongo and set the collection name
mongo = PyMongo(app)
users_collection = mongo.db.users  # This specifies the 'users' collection in the 'fitness-tracking' database

@app.route('/registration', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    age = data.get('age')

    # Check if all required fields are provided
    if not username or not password or not email or age is None:
        return jsonify({"error": "Username, password, email, and age are required"}), 400

    # Check if the username already exists
    user = users_collection.find_one({'username': username})
    if user:
        return jsonify({"error": "Username already exists"}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create a user document
    user_data = {
        'username': username,
        'password': hashed_password,
        'email': email,
        'age': age,
        'created_at': datetime.datetime.utcnow()
    }
    users_collection.insert_one(user_data)  # Insert the user document into the 'users' collection

    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if both username and password are provided
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Find the user by username
    user = users_collection.find_one({'username': username})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 400

    # Check if the provided password matches the hashed password stored in the database
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        # Generate a JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 400

if __name__ == '__main__':
    app.run(debug=True)

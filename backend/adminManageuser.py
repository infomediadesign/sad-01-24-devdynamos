from flask import Blueprint, request, jsonify, g
from bson.objectid import ObjectId
import jwt
from flasgger import swag_from
from bson import ObjectId

admin_manageuser_bp = Blueprint('admin_manageuser', __name__)

def init_admin_manageuser_routes(app, mongo):
    users_collection = mongo.db.users
    sessions_collection = mongo.db.sessions

    @admin_manageuser_bp.before_request
    def authenticate_admin():
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({"error": "Bearer token is missing"}), 401
        token = token.split('Bearer ')[1]
        try:
            payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            session = sessions_collection.find_one({'username': payload['username'], 'tokens': token})
            if not session or payload.get('hasRole') != 'admin':
                return jsonify({"error": "Unauthorized access"}), 401
            g.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    @admin_manageuser_bp.route('/users', methods=['GET'])
    @swag_from({
        "tags": ["Admin"],
        "summary": "View all users",
        "security": [{"Bearer": []}],
        "responses": {
            "200": {
                "description": "A list of users",
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "_id": {"type": "string"},
                            "username": {"type": "string"},
                            "email": {"type": "string"},
                            "hasRole": {"type": "string"}
                        }
                    }
                }
            },
            "401": {"description": "Unauthorized access or invalid token"}
        }
    })
    def get_all_users():
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        users = list(users_collection.find({}, {'password': 0}))  # Exclude password field
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify(users), 200

    @admin_manageuser_bp.route('/loggedusers', methods=['GET'])
    @swag_from({
        "tags": ["Admin"],
        "summary": "View all logged in users",
        "security": [{"Bearer": []}],
        "responses": {
            "200": {
                "description": "List of logged-in users",
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "_id": {"type": "string"},
                            "username": {"type": "string"},
                            "email": {"type": "string"},
                            "hasRole": {"type": "string"}
                        }
                    }
                }
            },
            "401": {"description": "Unauthorized access or invalid token"}
        }
    })
    def get_logged_in_users():
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401
        
        active_sessions = sessions_collection.find({}, {'_id': 0, 'username': 1})
        logged_in_users = []

        for session in active_sessions:
            user = users_collection.find_one({'username': session['username']}, {'_id': 1, 'username': 1, 'email': 1, 'hasRole': 1})
            if user:
                user['_id'] = str(user['_id'])  # Convert ObjectId to string
                logged_in_users.append(user)

        return jsonify(logged_in_users), 200
    
    @admin_manageuser_bp.route('/users/<string:username>', methods=['PUT'])
    @swag_from({
        "tags": ["Admin"],
        "summary": "Update user details",
        "security": [{"Bearer": []}],
        "parameters": [
            {
                "name": "username",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "The username of the user to update"
            },
            {
                "name": "body",
                "in": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "new_username": {"type": "string"},
                        "email": {"type": "string"},
                        "age": {"type": "integer"}
                    },
                    "required": ["username"]
                }
            }
        ],
        "responses": {
            "200": {
                "description": "User updated successfully",
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {"type": "string"}
                    }
                }
            },
            "400": {"description": "Invalid input data"},
            "401": {"description": "Unauthorized access or invalid token"},
            "404": {"description": "User not found"}
        }
    })
    def update_user(username):
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        data = request.get_json()
        new_username = data.get('new_username')
        email = data.get('email')
        age = data.get('age')

        update_data = {}
        if email:
            update_data['email'] = email
        if age:
            update_data['age'] = age
        if new_username:
            update_data['username'] = new_username

        if not update_data:
            return jsonify({"error": "Invalid input data"}), 400

        result = users_collection.update_one({'username': username}, {'$set': update_data})
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User updated successfully"}), 200

    app.register_blueprint(admin_manageuser_bp, url_prefix='/adminview')

from flask import Blueprint, request, jsonify, g
from bson.objectid import ObjectId
import jwt
from flasgger import swag_from

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

        # Query the sessions collection to fetch all active sessions
        active_sessions = sessions_collection.find({}, {'_id': 0, 'username': 1})

        # Create a list to store the details of logged-in users
        logged_in_users = []

        # Iterate through each session and fetch user details from the users collection
        for session in active_sessions:
            user = users_collection.find_one({'username': session['username']}, {'_id': 0, 'username': 1, 'email': 1, 'hasRole': 1})
            if user:
                logged_in_users.append(user)

        return jsonify(logged_in_users), 200

    app.register_blueprint(admin_manageuser_bp, url_prefix='/adminview')
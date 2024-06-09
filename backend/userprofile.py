from flask import Blueprint, jsonify, request, g
from bson import ObjectId
import json, jwt, bcrypt, re
from flasgger import Swagger

user_profile_bp = Blueprint('user_profile', __name__)

def init_user_profile_routes(app, mongo):
    users_collection = mongo.db.users

    @user_profile_bp.before_request
    def authenticate_user():
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({"error": "Bearer token is missing"}), 401
        token = token.split('Bearer ')[1]
        try:
            payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            user = users_collection.find_one({'username': payload['username']})
            if not user:
                return jsonify({"error": "User not found"}), 404
            g.user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    @user_profile_bp.route('/profile', methods=['GET'])
    def get_user_profile():
        """
        Get user profile
        ---
        tags:
          - User Profile
        responses:
          200:
            description: User profile retrieved successfully
          401:
            description: Unauthorized access
        """
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401
        user = g.user
        # Remove sensitive attributes
        user.pop('hasRole', None)
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        user = json.loads(json.dumps(user, default=str))  # Serialize BSON types
        return jsonify(user), 200

    @user_profile_bp.route('/profile', methods=['PUT'])
    def update_user_profile():
        """
        Update user profile
        ---
        tags:
          - User Profile
        parameters:
          - name: body
            in: body
            required: true
            schema:
              type: object
              properties:
                age:
                  type: integer
                username:
                  type: string
                email:
                  type: string
                password:
                  type: string
        responses:
          200:
            description: User profile updated successfully
          400:
            description: Bad request
          401:
            description: Unauthorized access
        """
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401
        user = g.user
        data = request.get_json()
        allowed_fields = {'age', 'username', 'email', 'password'}
        for field in data.keys():
            if field not in allowed_fields:
                return jsonify({"error": f"Invalid field to update: {field}"}), 400
        if 'password' in data:
            password = data['password']
            if len(password) < 8 or not re.search("[0-9]", password) or not re.search("[!@#$%^&*]", password):
                return jsonify({"error": "Password must be at least 8 characters long and contain at least one special character and one number"}), 400
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            data['password'] = hashed_password
        for field, value in data.items():
            user[field] = value
        users_collection.update_one({'_id': user['_id']}, {'$set': user})
        return jsonify({"message": "User profile updated successfully"}), 200

    @user_profile_bp.route('/account', methods=['DELETE'])
    def delete_user_account():
        """
        Delete user account
        ---
        tags:
          - User Profile
        responses:
          200:
            description: User account deleted successfully
          401:
            description: Unauthorized access
        """
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        users_collection.delete_one({'_id': g.user['_id']})
        return jsonify({"message": "Your account is deleted successfully"}), 200

    app.register_blueprint(user_profile_bp, url_prefix='/user')

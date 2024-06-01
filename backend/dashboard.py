from functools import wraps
from flask import Blueprint, request, jsonify, current_app
import jwt
from flask_cors import CORS
from config import Config

dashboard_bp = Blueprint('dashboard', __name__)
CORS(dashboard_bp)

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers.get('Authorization')
            token = auth_header.split(" ")[1] if auth_header else None

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            decoded_token = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            # Additional token validation checks can be added here
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(*args, **kwargs)

    return decorated_function

@dashboard_bp.route('/dashboard/<username>', methods=['GET'])
@token_required
def get_dashboard(username):
    return jsonify({'message': f'Welcome to the dashboard, {username}'})


from functools import wraps
from flask import Blueprint, request, jsonify, current_app, g
import jwt
from flask_cors import CORS
from flasgger import swag_from
from config import Config

dashboard_bp = Blueprint('dashboard', __name__)
CORS(dashboard_bp)

def init_dashboard_routes(app, mongo):
    sessions_collection = mongo.db.sessions

    @app.before_request
    def authenticate():
        if request.path.startswith('/dashboard'):
            token = request.headers.get('Authorization')
            if not token or not token.startswith('Bearer '):
                return jsonify({"error": "Bearer token is missing"}), 401
            token = token.split('Bearer ')[1]
            try:
                payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                g.user = payload
                session = sessions_collection.find_one({'username': payload['username'], 'tokens': token})
                if not session:
                    return jsonify({"error": "Invalid token"}), 401
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401

    @dashboard_bp.route('/dashboard', methods=['GET'])
    @swag_from({
        "tags": ["Dashboard"],
        "responses": {
            "200": {
                "description": "Dashboard data for the authenticated user."
            },
            "401": {
                "description": "Unauthorized access if token is missing or invalid."
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ]
    })
    def get_dashboard():
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        return jsonify({'message': f'Welcome to the dashboard, {g.user["username"]}'})

    app.register_blueprint(dashboard_bp, url_prefix='/')

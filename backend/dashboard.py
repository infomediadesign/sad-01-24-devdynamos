from functools import wraps
from flask import Blueprint, request, jsonify, current_app, g
import jwt
from flask_cors import CORS
from flasgger import swag_from
from config import Config
from datetime import datetime  # Correct import

dashboard_bp = Blueprint('dashboard', __name__)
CORS(dashboard_bp)

def init_dashboard_routes(app, mongo):
    sessions_collection = mongo.db.sessions
    calories_tracker_collection = mongo.db.calories_tracker  # Add reference to the calories tracker collection

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

    @dashboard_bp.route('/dashboard/current_week_progress', methods=['GET'])
    @swag_from({
        "tags": ["Dashboard"],
        "summary": "Get Current Week Progress",
        "description": "Retrieve the progress of the current week for the authenticated user.",
        "responses": {
            "200": {
                "description": "Current week's progress retrieved successfully."
            },
            "400": {
                "description": "Bad request or invalid data provided."
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
    def get_current_week_progress():
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        username = g.user['username']
        current_date = datetime.now().date()

        goals = list(calories_tracker_collection.find({'username': username}))
        if not goals:
            return jsonify({"error": "No active goals found"}), 400

        current_week_goal = None
        for goal in goals:
            start_date = datetime.strptime(goal['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(goal['end_date'], '%Y-%m-%d').date()
            if start_date <= current_date <= end_date:
                current_week_goal = goal
                break

        if not current_week_goal:
            return jsonify({"error": "No goals set for this week ☹"}), 400

        calories_burned = current_week_goal['calories_burned']

        return jsonify({'calories_burned': calories_burned}), 200

    app.register_blueprint(dashboard_bp, url_prefix='/')
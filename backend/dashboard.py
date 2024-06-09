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
    calories_tracker_collection = mongo.db.calories_tracker 
    progress_tracker_collection = mongo.db.progress_tracker

    @app.before_request
    def authenticate():
        if request.method == 'OPTIONS':
            return '', 204  # Allow OPTIONS requests without authentication
        
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
            
    def parse_date(date_str):
        for fmt in ('%Y-%m-%d', '%d-%m-%Y'):
            try:
                return datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        raise ValueError(f"time data {date_str} does not match any known format")

    @dashboard_bp.route('/calories', methods=['GET'])
    @swag_from({
        "tags": ["Dashboard"],
        "summary": "Get Current Week Calories Burned Progress",
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
            start_date = parse_date(goal['start_date'])
            end_date = parse_date(goal['end_date'])
            if start_date <= current_date <= end_date:
                current_week_goal = goal
                break

        if not current_week_goal:
            return jsonify({"error": "No goals set for this week ☹"}), 400

        calories_burned = current_week_goal['calories_burned']

        return jsonify({'calories_burned': calories_burned}), 200
    
    @dashboard_bp.route('/progress', methods=['GET'])
    @swag_from({
        'tags': ['Dashboard'],
        "summary": "Get Current Week Progress",
        'responses': {
            200: {'description': 'Success'},
            400: {'description': 'No goals this week'},
            401: {'description': 'Bearer token is missing or Token has expired or Invalid token'}
        },
        'parameters': []
    })
    def get_current_week_progresses():
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        username = g.user['username']
        current_date = datetime.now().date()

        goals = progress_tracker_collection.find({'username': username})

        if not goals:
            return jsonify({"error": "No goals this week"}), 400

        current_week_progress = None
        for goal in goals:
            start_date = parse_date(goal['start_date'])
            end_date = parse_date(goal['end_date'])
            if start_date <= current_date <= end_date:
                total_progress = sum(entry['progress'] for entry in goal['progresses'])
                current_week_progress = total_progress
                break

        if current_week_progress is None:
            return jsonify({"error": "No activity progress this week"}), 400

        return jsonify({'progress': current_week_progress}), 200

    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
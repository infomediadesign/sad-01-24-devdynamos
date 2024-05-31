from flask import Blueprint, request, jsonify, g
import datetime
import jwt
from functools import wraps
from flasgger import swag_from

def init_progress_routes(app, mongo):
    progress_bp = Blueprint('progress', __name__)
    users_collection = mongo.db.users
    progress_tracker_collection = mongo.db.progress_tracker

    def auth_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token or not token.startswith('Bearer '):
                return jsonify({"error": "Bearer token is missing"}), 401
            token = token.split('Bearer ')[1]
            try:
                payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                g.user = payload
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401
            return f(*args, **kwargs)
        return decorated_function

    @progress_bp.route('/set_progressgoal', methods=['POST'])
    @auth_required
    @swag_from({
        'tags': ['Progress'],
        'responses': {
            201: {'description': 'Goal set successfully'},
            400: {'description': 'All fields are required or Invalid username or A goal already exists for the specified period'},
            401: {'description': 'Bearer token is missing or Token has expired or Invalid token'}
        },
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'start_date': {'type': 'string', 'format': 'date'},
                        'end_date': {'type': 'string', 'format': 'date'},
                        'goal': {'type': 'string'},
                        'activity': {'type': 'string'}
                    },
                    'required': ['start_date', 'end_date', 'goal', 'activity']
                }
            }
        ],
        'security': [{'Bearer': []}]
    })
    def set_progress_goal():
        data = request.get_json()
        start_date, end_date, goal, activity = data.get('start_date'), data.get('end_date'), data.get('goal'), data.get('activity')

        if not start_date or not end_date or not goal or not activity:
            return jsonify({"error": "All fields are required"}), 400

        username = g.user['username']
        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        start_date_obj = datetime.datetime.strptime(start_date, '%Y-%m-%d').strftime('%Y-%m-%d')
        end_date_obj = datetime.datetime.strptime(end_date, '%Y-%m-%d').strftime('%Y-%m-%d')

        overlapping_goal = progress_tracker_collection.find_one({
            'username': username,
            '$or': [
                {'start_date': {'$lte': end_date_obj, '$gte': start_date_obj}},
                {'end_date': {'$gte': start_date_obj, '$lte': end_date_obj}},
                {'start_date': {'$lte': start_date_obj}, 'end_date': {'$gte': end_date_obj}}
            ]
        })

        if overlapping_goal:
            return jsonify({"error": "A goal already exists for the specified period"}), 400

        goal_data = {
            'username': username,
            'start_date': start_date_obj,
            'end_date': end_date_obj,
            'goal': goal,
            'activity': activity,
            'progresses': [],
            'created_at': datetime.datetime.utcnow().strftime('%Y-%m-%d')
        }
        progress_tracker_collection.insert_one(goal_data)
        return jsonify({"message": "Goal set successfully"}), 201

    @progress_bp.route('/progress_log', methods=['POST'])
    @auth_required
    @swag_from({
        'tags': ['Progress'],
        'responses': {
            200: {'description': 'Progress logged successfully'},
            400: {'description': 'All fields are required or Invalid username or No active goal for this period'},
            401: {'description': 'Bearer token is missing or Token has expired or Invalid token'}
        },
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'date': {'type': 'string', 'format': 'date'},
                        'progress': {'type': 'number'}
                    },
                    'required': ['date', 'progress']
                }
            }
        ],
        'security': [{'Bearer': []}]
    })
    def log_progress():
        data = request.get_json()
        date, progress_value = data.get('date'), data.get('progress')

        if not date or not progress_value:
            return jsonify({"error": "All fields are required"}), 400

        username = g.user['username']
        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        log_date = datetime.datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
        goal = progress_tracker_collection.find_one({'username': username, 'start_date': {'$lte': log_date}, 'end_date': {'$gte': log_date}})

        if not goal:
            return jsonify({"error": "No active goal for this period"}), 400

        result = progress_tracker_collection.update_one(
            {"_id": goal['_id'], "progresses.date": log_date},
            {"$inc": {"progresses.$.progress": progress_value}}
        )

        if result.matched_count == 0:
            # If no matching date was found, add a new element
            progress_tracker_collection.update_one(
                {"_id": goal['_id']},
                {"$push": {"progresses": {"date": log_date, "progress": progress_value}}}
            )

        message = "Progress logged successfully"
        if progress_value >= goal['goal']:
            message += " and goal achieved!"

        return jsonify({"message": message}), 200

    @progress_bp.route('/achieved', methods=['GET'])
    @auth_required
    @swag_from({
        'tags': ['Progress'],
        'responses': {
            200: {'description': 'Success'},
            400: {'description': 'Invalid username or No active goal'},
            401: {'description': 'Bearer token is missing or Token has expired or Invalid token'}
        },
        'parameters': []
    })
    def get_progress():
        username = g.user['username']
        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        goals = progress_tracker_collection.find({'username': username})

        if not goals:
            return jsonify({"error": "No active goal"}), 400

        goalsResult = []
        for goal in goals:
            total_progress = sum(entry['progress'] for entry in goal['progresses'])

            progress_data = {
                'goal': goal['goal'],
                'activity': goal['activity'],
                'progress': total_progress,
                'start_date': goal['start_date'],
                'end_date': goal['end_date']
            }
            goalsResult.append(progress_data)

        return jsonify(goalsResult), 200

    @progress_bp.route('/progress_bydate', methods=['GET'])
    @auth_required
    @swag_from({
        'tags': ['Progress'],
        'responses': {
            200: {'description': 'Success'},
            400: {'description': 'Date is required or Invalid username or No active goal for this period or No progress logged for this date'},
            401: {'description': 'Bearer token is missing or Token has expired or Invalid token'}
        },
        'parameters': [
            {'name': 'date', 'in': 'query', 'type': 'string', 'format': 'date', 'required': True}
        ],
        'security': [{'Bearer': []}]
    })
    def get_progress_by_date():
        date = request.args.get('date')

        if not date:
            return jsonify({"error": "Date is required"}), 400

        username = g.user['username']
        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        log_date = datetime.datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
        goal = progress_tracker_collection.find_one({
            'username': username,
            'start_date': {'$lte': log_date},
            'end_date': {'$gte': log_date}
        })

        if not goal:
            return jsonify({"error": "No active goal for this period"}), 400

        daily_log = next((entry for entry in goal['progresses'] if entry['date'] == log_date), None)

        if not daily_log:
            return jsonify({"error": "No progress logged for this date"}), 400

        return jsonify({"date": log_date, "progress": daily_log['progress']}), 200

    app.register_blueprint(progress_bp, url_prefix='/progress')
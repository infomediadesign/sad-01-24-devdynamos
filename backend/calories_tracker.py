from flask import Flask, Blueprint, request, jsonify, g
import datetime
import jwt
from config import Config
from functools import wraps

app = Flask(__name__)
app.config.from_object(Config)

calories_bp = Blueprint('calories', __name__)

def init_calories_routes(app, mongo):
    users_collection = mongo.db.users
    calories_tracker_collection = mongo.db.calories_tracker
    daily_calories_log_collection = mongo.db.daily_calories_log

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

    @calories_bp.route('/set_caloriesgoal', methods=['POST'])
    @auth_required
    def set_calorie_goal():
        data = request.get_json()
        username, start_date, end_date, goal, activity = data.get('username'), data.get('start_date'), data.get('end_date'), data.get('goal'), data.get('activity')

        if not username or not start_date or not end_date or not goal or not activity:
            return jsonify({"error": "All fields are required"}), 400

        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        start_date_obj = datetime.datetime.strptime(start_date, '%Y-%m-%d').strftime('%Y-%m-%d')
        end_date_obj = datetime.datetime.strptime(end_date, '%Y-%m-%d').strftime('%Y-%m-%d')

        overlapping_goal = calories_tracker_collection.find_one({
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
            'calories_burned': 0,
            'created_at': datetime.datetime.utcnow().strftime('%Y-%m-%d')
        }
        calories_tracker_collection.insert_one(goal_data)
        return jsonify({"message": "Goal set successfully"}), 201

    @calories_bp.route('/log', methods=['POST'])
    @auth_required
    def log_calories():
        data = request.get_json()
        username, date, calories = data.get('username'), data.get('date'), data.get('calories')

        if not username or not date or not calories:
            return jsonify({"error": "All fields are required"}), 400

        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        log_date = datetime.datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
        goal = calories_tracker_collection.find_one({'username': username, 'start_date': {'$lte': log_date}, 'end_date': {'$gte': log_date}})

        if not goal:
            return jsonify({"error": "No active goal for this period"}), 400

        existing_log = daily_calories_log_collection.find_one({'username': username, 'date': log_date})

        if existing_log:
            new_calories_burned = goal['calories_burned'] - existing_log['calories'] + calories
            daily_calories_log_collection.update_one(
                {'_id': existing_log['_id']},
                {'$set': {'calories': calories}}
            )
        else:
            new_calories_burned = goal['calories_burned'] + calories
            daily_calories_log_collection.insert_one({
                'username': username,
                'date': log_date,
                'calories': calories,
                'created_at': datetime.datetime.utcnow().strftime('%Y-%m-%d')
            })

        calories_tracker_collection.update_one(
            {'_id': goal['_id']},
            {'$set': {'calories_burned': new_calories_burned}}
        )

        return jsonify({"message": "Calories logged successfully"}), 200

    @calories_bp.route('/progress', methods=['GET'])
    @auth_required
    def get_progress():
        username = request.args.get('username')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        if not username or not start_date or not end_date:
            return jsonify({"error": "Username, start_date, and end_date are required"}), 400

        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        try:
            start_date_obj = datetime.datetime.strptime(start_date, '%Y-%m-%d').strftime('%Y-%m-%d')
            end_date_obj = datetime.datetime.strptime(end_date, '%Y-%m-%d').strftime('%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        goal = calories_tracker_collection.find_one({
            'username': username,
            'start_date': {'$lte': end_date_obj},
            'end_date': {'$gte': start_date_obj}
        })

        if not goal:
            return jsonify({"error": "No active goal for this period"}), 400

        progress = {
            'goal': goal['goal'],
            'calories_burned': goal['calories_burned'],
            'activity': goal['activity'],
            'start_date': goal['start_date'],
            'end_date': goal['end_date']
        }
        return jsonify(progress), 200

    @calories_bp.route('/calories_bydate', methods=['GET'])
    @auth_required
    def get_calories_by_date():
        username = request.args.get('username')
        date = request.args.get('date')

        if not username or not date:
            return jsonify({"error": "Username and date are required"}), 400

        user = users_collection.find_one({'username': username})
        if not user:
            return jsonify({"error": "Invalid username"}), 400

        try:
            date_obj = datetime.datetime.strptime(date, '%Y-%m-%d').strftime('%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        daily_log = daily_calories_log_collection.find_one({
            'username': username,
            'date': date_obj
        })

        if not daily_log:
            return jsonify({"error": "No calories logged for this date"}), 400

        return jsonify({"username": username, "date": date, "calories": daily_log['calories']}), 200

    app.register_blueprint(calories_bp, url_prefix='/calories')

if __name__ == "__main__":
    from flask_pymongo import PyMongo
    app.config["MONGO_URI"] = Config.MONGO_URI
    mongo = PyMongo(app)
    init_calories_routes(app, mongo)
    app.run(debug=True)

from flask import Blueprint, request, jsonify, g
from flasgger import Swagger, swag_from
from config import Config
from functools import wraps
import jwt
import datetime

workouts_bp = Blueprint('workouts', __name__)

def init_workouts_routes(app, mongo):
    body_parts_collection = mongo.db.bodyParts
    exercises_collection = mongo.db.exercises
    sessions_collection = mongo.db.sessions

    def auth_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if request.method == 'OPTIONS':
                return '', 204  # Allow OPTIONS requests without authentication
            
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
            return f(*args, **kwargs)
        return decorated_function

    @workouts_bp.route('/exercises/<string:body_part>', methods=['GET'])
    @auth_required
    @swag_from({
        'tags': ['Exercises'],
        'parameters': [
            {
                'name': 'body_part',
                'in': 'path',
                'type': 'string',
                'required': True,
                'description': 'The name of the body part.'
            }
        ],
        'responses': {
            200: {
                'description': 'A list of exercises for the specified body part.',
                'schema': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            '_id': {'type': 'string'},
                            'name': {'type': 'string'},
                            'description': {'type': 'string'},
                            'bodyPart_ref': {'type': 'string'}
                        }
                    }
                }
            },
            401: {
                'description': 'Unauthorized access if token is missing or invalid.'
            },
            404: {
                'description': 'Body part not found.'
            }
        },
        'security': [{'Bearer': []}]
    })
    def get_exercises_by_body_part(body_part):
        body_part_document = body_parts_collection.find_one({'name': body_part})
        if not body_part_document:
            return jsonify({"error": "Body part not found"}), 404

        body_part_id = body_part_document['_id']
        exercises = list(exercises_collection.find({'bodyPart_ref': str(body_part_id)}))
        for exercise in exercises:
            exercise['_id'] = str(exercise['_id'])
            exercise['bodyPart_ref'] = str(exercise['bodyPart_ref'])

        return jsonify(exercises), 200

    app.register_blueprint(workouts_bp, url_prefix='/workouts')

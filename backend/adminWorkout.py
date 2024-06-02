from flask import Blueprint, request, jsonify, g
from bson.objectid import ObjectId
import jwt
from flasgger import swag_from

admin_bp = Blueprint('admin', __name__)

def init_admin_routes(app, mongo):
    exercises_collection = mongo.db.exercises
    body_parts_collection = mongo.db.bodyParts
    sessions_collection = mongo.db.sessions

    @admin_bp.before_request
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

    @admin_bp.route('/exercises', methods=['POST'])
    @swag_from({
        "tags": ["Admin"],
        "security": [{"Bearer": []}],
        "parameters": [
            {
                "name": "body",
                "in": "body",
                "required": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "youtube_link": {"type": "string"},
                        "bodyPart": {"type": "string"},
                        "description": {"type": "string"}
                    },
                    "required": ["name", "youtube_link", "bodyPart", "description"]
                }
            }
        ],
        "responses": {
            "201": {
                "description": "Exercise added successfully",
                "schema": {
                    "type": "object",
                    "properties": {
                        "message": {"type": "string"},
                        "id": {"type": "string"}
                    }
                }
            },
            "400": {"description": "Missing required fields"},
            "401": {"description": "Unauthorized access or invalid token"},
            "404": {"description": "Body part not found"}
        }
    })
    def add_exercise():
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        data = request.get_json()
        required_fields = ['name', 'youtube_link', 'bodyPart', 'description']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        body_part_document = body_parts_collection.find_one({'name': data['bodyPart']})
        if not body_part_document:
            return jsonify({"error": "Body part not found"}), 404

        exercise = {
            "name": data['name'],
            "youtube_link": data['youtube_link'],
            "bodyPart_ref": str(body_part_document['_id']),
            "description": data['description']
        }

        result = exercises_collection.insert_one(exercise)
        return jsonify({"message": "Exercise added successfully"}), 201
    
    @admin_bp.route('/exercises/<string:exercise_id>', methods=['DELETE'])
    def delete_exercise(exercise_id):
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        result = exercises_collection.delete_one({'_id': ObjectId(exercise_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Exercise not found"}), 404

        return jsonify({"message": "Exercise deleted successfully"}), 200

    app.register_blueprint(admin_bp, url_prefix='/admin')
    

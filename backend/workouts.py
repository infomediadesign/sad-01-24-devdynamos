from flask import Blueprint, request, jsonify, g
from flasgger import Swagger, swag_from
from flask_cors import CORS
from config import Config
import jwt
from mongoengine import Document, StringField, ReferenceField, ListField
from bson.objectid import ObjectId

workouts_bp = Blueprint('workouts', __name__)

class BodyPart(Document):
    name = StringField(required=True, unique=True)

    meta = {'collection': 'bodyParts'}

class Exercise(Document):
    bodyPart_ref = ReferenceField(BodyPart)
    name = StringField(required=True)

    meta = {'collection': 'exercises'}

class Session(Document):
    username = StringField(required=True, unique=True)
    tokens = ListField(StringField())

    meta = {'collection': 'sessions'}

def init_workouts_routes(app):
    @app.before_request
    def authenticate():
        if request.path.startswith('/workouts'):
            token = request.headers.get('Authorization')
            if not token or not token.startswith('Bearer '):
                return jsonify({"error": "Bearer token is missing"}), 401
            token = token.split('Bearer ')[1]
            try:
                payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                g.user = payload
                session = Session.objects(username=payload['username'], tokens=token).first()
                if not session:
                    return jsonify({"error": "Invalid token"}), 401
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401

    @workouts_bp.route('/exercises/<string:body_part>', methods=['GET'])
    @swag_from({
        "tags": ["Exercises"],
        "parameters": [
            {
                "name": "body_part",
                "in": "path",
                "type": "string",
                "required": True,
                "description": "The name of the body part."
            }
        ],
        "responses": {
            "200": {
                "description": "A list of exercises for the specified body part."
            },
            "401": {
                "description": "Unauthorized access if token is missing or invalid."
            },
            "404": {
                "description": "Body part not found."
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ]
    })
    def get_exercises_by_body_part(body_part):
        if not hasattr(g, 'user'):
            return jsonify({"error": "Unauthorized access"}), 401

        body_part_document = BodyPart.objects(name=body_part).first()
        if not body_part_document:
            return jsonify({"error": "Body part not found"}), 404

        exercises = Exercise.objects(bodyPart_ref=body_part_document)
        exercises_list = [{'id': str(exercise.id), 'name': exercise.name} for exercise in exercises]

        return jsonify(exercises_list), 200

    app.register_blueprint(workouts_bp, url_prefix='/workouts')

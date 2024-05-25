from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flasgger import Swagger
from flask_cors import CORS
from bson.objectid import ObjectId
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

mongo = PyMongo(app)
body_parts_collection = mongo.db.bodyParts
exercises_collection = mongo.db.excercises

swagger = Swagger(app)
CORS(app)  # Enable CORS for all routes

@app.route('/exercises/<string:body_part>', methods=['GET'])
def get_exercises_by_body_part(body_part):
    """Get exercises by body part.
    ---
    parameters:
      - name: body_part
        in: path
        type: string
        required: true
        description: The name of the body part.
    responses:
      200:
        description: A list of exercises for the specified body part.
      404:
        description: Body part not found.
    """
    body_part_document = body_parts_collection.find_one({'name': body_part})
    if not body_part_document:
        return jsonify({"error": "Body part not found"}), 404

    body_part_id = body_part_document['_id']
    print("BODY_PART:: " , str(body_part_id))
    exercises = list(exercises_collection.find({'bodyPart_ref' : str(body_part_id)}))
    
     # Convert ObjectId to string for each exercise
    for exercise in exercises:
        exercise['_id'] = str(exercise['_id'])
        exercise['bodyPart_ref'] = str(exercise['bodyPart_ref'])
    print("EXCERCISES ::: ", exercises)

    return jsonify(exercises), 200

if __name__ == '__main__':
    app.run(debug=True)

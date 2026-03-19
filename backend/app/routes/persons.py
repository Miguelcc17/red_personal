from flask import Blueprint, request
from ..services.person_service import person_service
from ..schemas.person_schema import PersonSchema
from ..utils.responses import success_response, error_response
from marshmallow import ValidationError

persons_bp = Blueprint('persons', __name__)
person_schema = PersonSchema()
persons_list_schema = PersonSchema(many=True)

@persons_bp.route('/persons', methods=['GET'])
def get_persons():
    persons = person_service.get_all_persons()
    return success_response(persons_list_schema.dump(persons))

@persons_bp.route('/persons', methods=['POST'])
def create_person():
    data = request.get_json()
    try:
        validated_data = person_schema.load(data)
    except ValidationError as err:
        return error_response("Validation error", status_code=422, errors=err.messages)

    person = person_service.create_person(validated_data)
    return success_response(person_schema.dump(person), status_code=201)

@persons_bp.route('/persons/<string:id>', methods=['GET'])
def get_person(id):
    person = person_service.get_person_by_id(id)
    if not person:
        return error_response("Person not found", status_code=404)
    return success_response(person_schema.dump(person))

@persons_bp.route('/persons/<string:id>', methods=['PUT'])
def update_person(id):
    data = request.get_json()
    try:
        # Partial update
        validated_data = person_schema.load(data, partial=True)
    except ValidationError as err:
        return error_response("Validation error", status_code=422, errors=err.messages)

    person = person_service.update_person(id, validated_data)
    if not person:
        return error_response("Person not found", status_code=404)
    return success_response(person_schema.dump(person))

@persons_bp.route('/persons/<string:id>', methods=['DELETE'])
def delete_person(id):
    deleted = person_service.delete_person(id)
    if not deleted:
        return error_response("Person not found", status_code=404)
    return success_response(None, message="Person deleted successfully")

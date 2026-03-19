from flask import Blueprint, request
from ..services.relationship_service import relationship_service
from ..schemas.person_schema import RelationshipSchema
from ..utils.responses import success_response, error_response
from marshmallow import ValidationError

relationships_bp = Blueprint('relationships', __name__)
relationship_schema = RelationshipSchema()
relationships_list_schema = RelationshipSchema(many=True)

@relationships_bp.route('/relationships', methods=['GET'])
def get_relationships():
    relationships = relationship_service.get_all_relationships()
    return success_response(relationships_list_schema.dump(relationships))

@relationships_bp.route('/relationships', methods=['POST'])
def create_relationship():
    data = request.get_json()
    try:
        validated_data = relationship_schema.load(data)
    except ValidationError as err:
        return error_response("Validation error", status_code=422, errors=err.messages)

    p1_id = validated_data.pop('p1_id')
    p2_id = validated_data.pop('p2_id')

    relationship = relationship_service.create_relationship(p1_id, p2_id, validated_data)
    if not relationship:
        return error_response("Failed to create relationship. Check if persons exist.", status_code=400)
    return success_response(relationship_schema.dump(relationship), status_code=201)

@relationships_bp.route('/relationships/<string:id>', methods=['GET'])
def get_relationship(id):
    relationship = relationship_service.get_relationship_by_id(id)
    if not relationship:
        return error_response("Relationship not found", status_code=404)
    return success_response(relationship_schema.dump(relationship))

@relationships_bp.route('/relationships/<string:id>', methods=['PUT'])
def update_relationship(id):
    data = request.get_json()
    try:
        validated_data = relationship_schema.load(data, partial=True)
    except ValidationError as err:
        return error_response("Validation error", status_code=422, errors=err.messages)

    # Optional: logic to check if p1_id/p2_id are provided (usually not allowed in PUT for relationships)
    relationship = relationship_service.update_relationship(id, validated_data)
    if not relationship:
        return error_response("Relationship not found", status_code=404)
    return success_response(relationship_schema.dump(relationship))

@relationships_bp.route('/relationships/<string:id>', methods=['DELETE'])
def delete_relationship(id):
    deleted = relationship_service.delete_relationship(id)
    if not deleted:
        return error_response("Relationship not found", status_code=404)
    return success_response(None, message="Relationship deleted successfully")

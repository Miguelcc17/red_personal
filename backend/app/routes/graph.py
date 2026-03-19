from flask import Blueprint
from ..services.graph_service import graph_service
from ..utils.responses import success_response, error_response

graph_bp = Blueprint('graph', __name__)

@graph_bp.route('/graph', methods=['GET'])
def get_graph():
    graph_data = graph_service.get_full_graph()
    return success_response(graph_data)

@graph_bp.route('/graph/person/<string:id>', methods=['GET'])
def get_person_graph(id):
    graph_data = graph_service.get_graph_by_person(id)
    if not graph_data or not graph_data['nodes']:
        return error_response("Person not found in graph", status_code=404)
    return success_response(graph_data)

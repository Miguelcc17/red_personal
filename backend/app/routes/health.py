from flask import Blueprint, current_app
from ..utils.responses import success_response, error_response
from ..repositories.neo4j_connection import neo4j_conn

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health():
    try:
        # Check Neo4j connectivity
        if neo4j_conn and neo4j_conn.driver:
            neo4j_conn.driver.verify_connectivity()
            return success_response({"status": "healthy", "neo4j": "connected"}, message="Backend is running and database is connected")
        else:
            return error_response("Neo4j driver not initialized", status_code=503)
    except Exception as e:
        return error_response(f"Neo4j connection error: {str(e)}", status_code=503)

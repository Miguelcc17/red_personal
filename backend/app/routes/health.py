from flask import Blueprint
from ..utils.responses import success_response

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health():
    return success_response({"status": "healthy"}, message="Backend is running")

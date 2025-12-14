from flask import Blueprint

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'message': 'API is running normally',
        'version': '1.0.0'
    }, 200

@health_bp.route('/status', methods=['GET'])
def status():
    """Detailed status endpoint"""
    return {
        'status': 'healthy',
        'api': 'running',
        'database': 'connected',  # In production, this would check actual DB connection
        'auth': 'enabled'
    }, 200
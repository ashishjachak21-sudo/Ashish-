import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import config

# Extensions
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config['CORS_ORIGINS'])
    limiter.init_app(app)
    
    # JWT configuration
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'message': 'Token has expired', 'error': 'token_expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'message': 'Invalid token', 'error': 'invalid_token'}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'message': 'Authorization token is required', 'error': 'authorization_required'}, 401
    
    # Import and register blueprints
    from auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Import and register health check
    from health import health_bp
    app.register_blueprint(health_bp, url_prefix='/api')
    
    @app.route('/')
    def index():
        return {'message': 'API is running', 'version': '1.0.0'}
    
    return app
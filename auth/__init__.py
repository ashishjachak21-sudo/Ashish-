from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity, get_jwt
)
from pydantic import ValidationError as PydanticValidationError
from datetime import timedelta
from functools import wraps

from schemas import (
    UserRegistrationRequest, UserRegistrationResponse, UserLoginRequest, UserLoginResponse,
    TokenRefreshRequest, TokenRefreshResponse, PasswordChangeRequest, UserResponse,
    ErrorResponse, ValidationErrorResponse
)
from auth_service import AuthService
from app import limiter

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

def validate_json(schema_class):
    """Decorator to validate JSON input against Pydantic schema"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify(ValidationErrorResponse(
                    error="invalid_request",
                    message="Request must be JSON"
                ).model_dump()), 400
            
            try:
                json_data = request.get_json()
                if json_data is None:
                    return jsonify(ValidationErrorResponse(
                        error="validation_error",
                        message="Invalid JSON",
                        details=["Request body is empty or malformed"]
                    ).model_dump()), 400
                
                # Use Pydantic model_validate instead of Marshmallow
                data = schema_class.model_validate(json_data)
                # Convert to dict to ensure it's serializable
                data = data.model_dump()
                return f(data, *args, **kwargs)
                
            except PydanticValidationError as err:
                error_details = []
                for error in err.errors():
                    field = '.'.join(str(x) for x in error['loc'])
                    error_details.append(f"{field}: {error['msg']}")
                return jsonify(ValidationErrorResponse(
                    error="validation_error",
                    message="Validation failed",
                    details=error_details
                ).model_dump()), 400
            except Exception as ve:
                return jsonify(ValidationErrorResponse(
                    error="validation_error",
                    message="Validation failed",
                    details=[str(ve)]
                ).model_dump()), 400
            
        return decorated_function
    return decorator

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
@validate_json(UserRegistrationRequest)
def register(data):
    """Register a new user"""
    try:
        # Check if user already exists
        from models import User
        from app import db
        
        with db.session() as session:
            existing_user = session.query(User).filter(User.email == data['email']).first()
            if existing_user:
                return jsonify(ErrorResponse(
                    error="user_exists",
                    message="User with this email already exists"
                ).model_dump()), 409
        
        # Create user
        user = auth_service.create_user(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        
        # Create tokens
        access_token = auth_service.create_access_token(user.id)
        refresh_token = auth_service.create_refresh_token(user.id)
        
        # Calculate expiry time
        expires_in = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=1))
        expires_in_seconds = int(expires_in.total_seconds())
        
        response = UserLoginResponse(
            message="User registered successfully",
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in_seconds,
            user=UserResponse(**user.to_dict())
        )
        
        return jsonify(response.model_dump()), 201
        
    except ValueError as e:
        return jsonify(ErrorResponse(
            error="user_exists",
            message=str(e)
        ).model_dump()), 409
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify(ErrorResponse(
            error="internal_error",
            message=f"An error occurred during registration: {str(e)}"
        ).model_dump()), 500

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
@validate_json(UserLoginRequest)
def login(data):
    """Login user and return tokens"""
    user = auth_service.authenticate_user(data['email'], data['password'])
    
    if not user:
        return jsonify(ErrorResponse(
            error="invalid_credentials",
            message="Invalid email or password"
        ).model_dump()), 401
    
    if not user.is_active:
        return jsonify(ErrorResponse(
            error="account_inactive",
            message="Account is deactivated"
        ).model_dump()), 403
    
    # Create tokens
    access_token = auth_service.create_access_token(user.id)
    refresh_token = auth_service.create_refresh_token(user.id)
    
    # Calculate expiry time
    expires_in = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=1))
    expires_in_seconds = int(expires_in.total_seconds())
    
    response = UserLoginResponse(
        message="Login successful",
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in_seconds,
        user=UserResponse(**user.to_dict())
    )
    
    return jsonify(response.model_dump()), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@limiter.limit("20 per minute")
@validate_json(TokenRefreshRequest)
def refresh(data):
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        user = auth_service.get_user_by_id(current_user_id)
        
        if not user or not user.is_active:
            return jsonify(ErrorResponse(
                error="user_not_found",
                message="User not found or inactive"
            ).model_dump()), 404
        
        # Create new access token
        access_token = auth_service.create_access_token(user.id)
        
        # Calculate expiry time
        expires_in = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=1))
        expires_in_seconds = int(expires_in.total_seconds())
        
        response = TokenRefreshResponse(
            access_token=access_token,
            expires_in=expires_in_seconds
        )
        
        return jsonify(response.model_dump()), 200
        
    except Exception as e:
        return jsonify(ErrorResponse(
            error="refresh_failed",
            message="Token refresh failed"
        ).model_dump()), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = auth_service.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify(ErrorResponse(
                error="user_not_found",
                message="User not found"
            ).model_dump()), 404
        
        return jsonify(UserResponse(**user.to_dict())), 200
        
    except Exception as e:
        return jsonify(ErrorResponse(
            error="internal_error",
            message="An error occurred"
        ).model_dump()), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
@limiter.limit("5 per minute")
@validate_json(PasswordChangeRequest)
def change_password(data):
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        
        success = auth_service.change_password(
            user_id=current_user_id,
            current_password=data['current_password'],
            new_password=data['new_password']
        )
        
        if not success:
            return jsonify(ErrorResponse(
                error="invalid_current_password",
                message="Current password is incorrect"
            ).model_dump()), 400
        
        return jsonify({"message": "Password changed successfully"}), 200
        
    except Exception as e:
        return jsonify(ErrorResponse(
            error="internal_error",
            message="An error occurred while changing password"
        ).model_dump()), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client should discard tokens)"""
    # In a more sophisticated implementation, you might maintain a token blacklist
    # For now, we just inform the client to discard their tokens
    return jsonify({"message": "Successfully logged out"}), 200

@auth_bp.route('/logout/refresh', methods=['POST'])
@jwt_required(refresh=True)
def logout_refresh():
    """Logout user using refresh token"""
    return jsonify({"message": "Successfully logged out"}), 200
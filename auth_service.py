from datetime import datetime, timedelta
from typing import Optional
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Session
from models import User
from app import db
from flask import current_app

class AuthService:
    def __init__(self):
        pass
    
    def hash_password(self, password: str) -> str:
        """Hash a password using Werkzeug's PBKDF2 implementation"""
        return generate_password_hash(password)
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        return check_password_hash(password_hash, password)
    
    def create_user(self, email: str, password: str, first_name: str, last_name: str) -> User:
        """Create a new user with hashed password"""
        with db.session() as session:
            # Check if user already exists
            existing_user = session.query(User).filter(User.email == email).first()
            if existing_user:
                raise ValueError("User with this email already exists")
            
            # Create new user
            password_hash = self.hash_password(password)
            user = User(
                email=email,
                password_hash=password_hash,
                first_name=first_name,
                last_name=last_name
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        with db.session() as session:
            user = session.query(User).filter(User.email == email).first()
            if not user or not self.verify_password(password, user.password_hash):
                return None
            return user
    
    def create_access_token(self, user_id: int) -> str:
        """Create access token for user"""
        expires_delta = current_app.config.get('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=1))
        return create_access_token(identity=user_id, expires_delta=expires_delta)
    
    def create_refresh_token(self, user_id: int) -> str:
        """Create refresh token for user"""
        expires_delta = current_app.config.get('JWT_REFRESH_TOKEN_EXPIRES', timedelta(days=30))
        return create_refresh_token(identity=user_id, expires_delta=expires_delta)
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        with db.session() as session:
            return session.query(User).filter(User.id == user_id).first()
    
    def change_password(self, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user's password"""
        with db.session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user or not self.verify_password(current_password, user.password_hash):
                return False
            
            user.password_hash = self.hash_password(new_password)
            session.commit()
            return True
    
    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate user account"""
        with db.session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            user.is_active = False
            session.commit()
            return True
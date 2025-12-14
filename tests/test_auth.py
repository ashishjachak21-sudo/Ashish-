import pytest
import json
from app import create_app, db
from models import User
from auth_service import AuthService

@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def auth_service():
    """Create auth service instance"""
    return AuthService()

@pytest.fixture
def test_user_data():
    """Return test user data"""
    return {
        'email': 'test@example.com',
        'password': 'TestPassword123',
        'first_name': 'John',
        'last_name': 'Doe'
    }

@pytest.fixture 
def test_user(app, client, test_user_data):
    """Create and return a test user"""
    # Register user
    response = client.post('/api/auth/register', 
                          json=test_user_data,
                          content_type='application/json')
    return json.loads(response.data.decode())

class TestUserRegistration:
    """Test user registration endpoints"""
    
    def test_register_success(self, client, test_user_data):
        """Test successful user registration"""
        response = client.post('/api/auth/register',
                              json=test_user_data,
                              content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data.decode())
        assert 'message' in data
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert 'user' in data
        assert data['user']['email'] == test_user_data['email']
        assert data['user']['first_name'] == test_user_data['first_name']
        assert data['user']['last_name'] == test_user_data['last_name']
    
    def test_register_duplicate_email(self, client, test_user_data):
        """Test registration with duplicate email"""
        # Register user first time
        client.post('/api/auth/register',
                   json=test_user_data,
                   content_type='application/json')
        
        # Try to register again
        response = client.post('/api/auth/register',
                              json=test_user_data,
                              content_type='application/json')
        
        assert response.status_code == 409
        data = json.loads(response.data.decode())
        assert data['error'] == 'user_exists'
        assert 'already exists' in data['message']
    
    def test_register_weak_password(self, client):
        """Test registration with weak password"""
        weak_password_data = {
            'email': 'test@example.com',
            'password': 'weak',  # Too short and weak
            'first_name': 'John',
            'last_name': 'Doe'
        }
        
        response = client.post('/api/auth/register',
                              json=weak_password_data,
                              content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data.decode())
        assert data['error'] == 'validation_error'
        assert 'validation_error' in data['details']
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email"""
        invalid_email_data = {
            'email': 'invalid-email',
            'password': 'TestPassword123',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        
        response = client.post('/api/auth/register',
                              json=invalid_email_data,
                              content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data.decode())
        assert data['error'] == 'validation_error'
    
    def test_register_short_names(self, client):
        """Test registration with too short names"""
        short_names_data = {
            'email': 'test@example.com',
            'password': 'TestPassword123',
            'first_name': 'J',
            'last_name': 'D'
        }
        
        response = client.post('/api/auth/register',
                              json=short_names_data,
                              content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data.decode())
        assert data['error'] == 'validation_error'
    
    def test_register_non_json_request(self, client):
        """Test registration with non-JSON content"""
        response = client.post('/api/auth/register',
                              data='not json',
                              content_type='text/plain')
        
        assert response.status_code == 400
        data = json.loads(response.data.decode())
        assert data['error'] == 'invalid_request'

class TestUserLogin:
    """Test user login endpoints"""
    
    def test_login_success(self, client, test_user):
        """Test successful user login"""
        login_data = {
            'email': 'test@example.com',
            'password': 'TestPassword123'
        }
        
        response = client.post('/api/auth/login',
                              json=login_data,
                              content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert data['message'] == 'Login successful'
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert 'user' in data
    
    def test_login_invalid_email(self, client, test_user):
        """Test login with invalid email"""
        login_data = {
            'email': 'wrong@example.com',
            'password': 'TestPassword123'
        }
        
        response = client.post('/api/auth/login',
                              json=login_data,
                              content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data.decode())
        assert data['error'] == 'invalid_credentials'
    
    def test_login_invalid_password(self, client, test_user):
        """Test login with invalid password"""
        login_data = {
            'email': 'test@example.com',
            'password': 'WrongPassword123'
        }
        
        response = client.post('/api/auth/login',
                              json=login_data,
                              content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data.decode())
        assert data['error'] == 'invalid_credentials'
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent user"""
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'SomePassword123'
        }
        
        response = client.post('/api/auth/login',
                              json=login_data,
                              content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data.decode())
        assert data['error'] == 'invalid_credentials'

class TestTokenRefresh:
    """Test token refresh endpoints"""
    
    def test_refresh_success(self, client, test_user):
        """Test successful token refresh"""
        # Get refresh token from registration
        refresh_token = test_user['refresh_token']
        
        refresh_data = {
            'refresh_token': refresh_token
        }
        
        response = client.post('/api/auth/refresh',
                              json=refresh_data,
                              content_type='application/json',
                              headers={'Authorization': f'Bearer {refresh_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert 'access_token' in data
        assert 'token_type' in data
        assert 'expires_in' in data
        assert data['token_type'] == 'bearer'
    
    def test_refresh_invalid_token(self, client):
        """Test refresh with invalid token"""
        refresh_data = {
            'refresh_token': 'invalid_token'
        }
        
        response = client.post('/api/auth/refresh',
                              json=refresh_data,
                              content_type='application/json',
                              headers={'Authorization': 'Bearer invalid_token'})
        
        assert response.status_code == 401

class TestProtectedRoutes:
    """Test protected route endpoints"""
    
    def test_get_current_user_success(self, client, test_user):
        """Test getting current user profile"""
        access_token = test_user['access_token']
        
        response = client.get('/api/auth/me',
                             headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert data['email'] == 'test@example.com'
        assert data['first_name'] == 'John'
        assert data['last_name'] == 'Doe'
        assert 'id' in data
    
    def test_get_current_user_no_token(self, client):
        """Test getting current user without token"""
        response = client.get('/api/auth/me')
        
        assert response.status_code == 401
    
    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token"""
        response = client.get('/api/auth/me',
                             headers={'Authorization': 'Bearer invalid_token'})
        
        assert response.status_code == 401
    
    def test_change_password_success(self, client, test_user):
        """Test successful password change"""
        access_token = test_user['access_token']
        
        password_data = {
            'current_password': 'TestPassword123',
            'new_password': 'NewPassword456'
        }
        
        response = client.post('/api/auth/change-password',
                              json=password_data,
                              content_type='application/json',
                              headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert 'successfully' in data['message']
    
    def test_change_password_wrong_current(self, client, test_user):
        """Test password change with wrong current password"""
        access_token = test_user['access_token']
        
        password_data = {
            'current_password': 'WrongPassword123',
            'new_password': 'NewPassword456'
        }
        
        response = client.post('/api/auth/change-password',
                              json=password_data,
                              content_type='application/json',
                              headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data.decode())
        assert data['error'] == 'invalid_current_password'
    
    def test_change_password_weak_new(self, client, test_user):
        """Test password change with weak new password"""
        access_token = test_user['access_token']
        
        password_data = {
            'current_password': 'TestPassword123',
            'new_password': 'weak'  # Too weak
        }
        
        response = client.post('/api/auth/change-password',
                              json=password_data,
                              content_type='application/json',
                              headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data.decode())
        assert data['error'] == 'validation_error'

class TestLogout:
    """Test logout endpoints"""
    
    def test_logout_success(self, client, test_user):
        """Test successful logout"""
        access_token = test_user['access_token']
        
        response = client.post('/api/auth/logout',
                              headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert 'successfully logged out' in data['message']
    
    def test_logout_refresh_success(self, client, test_user):
        """Test successful logout with refresh token"""
        refresh_token = test_user['refresh_token']
        
        response = client.post('/api/auth/logout/refresh',
                              headers={'Authorization': f'Bearer {refresh_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert 'successfully logged out' in data['message']

class TestRateLimiting:
    """Test rate limiting"""
    
    def test_registration_rate_limit(self, client):
        """Test registration rate limiting"""
        user_data = {
            'email': 'rate@example.com',
            'password': 'TestPassword123',
            'first_name': 'Rate',
            'last_name': 'Test'
        }
        
        # Make multiple requests quickly
        responses = []
        for i in range(10):
            response = client.post('/api/auth/register',
                                  json=user_data,
                                  content_type='application/json')
            responses.append(response)
        
        # Some requests should be rate limited (status 429)
        rate_limited_responses = [r for r in responses if r.status_code == 429]
        assert len(rate_limited_responses) > 0

class TestHealthEndpoints:
    """Test health check endpoints"""
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/api/health/health')
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert data['status'] == 'healthy'
        assert 'message' in data
    
    def test_status_endpoint(self, client):
        """Test status endpoint"""
        response = client.get('/api/health/status')
        
        assert response.status_code == 200
        data = json.loads(response.data.decode())
        assert data['status'] == 'healthy'
        assert data['api'] == 'running'
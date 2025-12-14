# Authentication API Documentation

This document provides comprehensive documentation for the Authentication API, including endpoints, request/response formats, and usage examples.

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Rate Limiting](#rate-limiting)
5. [Error Handling](#error-handling)
6. [Endpoints](#endpoints)
7. [Token Usage](#token-usage)
8. [Examples](#examples)

## Overview

The Authentication API provides secure user registration, login, and session management using JWT tokens with access and refresh token pairs. The API implements secure password hashing, input validation, rate limiting, and proper error handling.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with two types of tokens:

- **Access Token**: Short-lived token (default: 1 hour) used for authenticating API requests
- **Refresh Token**: Long-lived token (default: 30 days) used to obtain new access tokens

### Token Format

Tokens are returned as Bearer tokens:
```
Authorization: Bearer <token>
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Registration**: 5 requests per minute per IP
- **Login**: 10 requests per minute per IP
- **Token Refresh**: 20 requests per minute per IP
- **Password Change**: 5 requests per minute per user
- **General**: 200 requests per day, 50 per hour per IP

When rate limits are exceeded, the API returns HTTP 429 (Too Many Requests).

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "error_type",
  "message": "Human-readable error message",
  "details": ["Specific validation errors or additional info"]
}
```

### Common Error Types

| Error Type | HTTP Status | Description |
|------------|-------------|-------------|
| `validation_error` | 400 | Input validation failed |
| `invalid_request` | 400 | Malformed request |
| `invalid_credentials` | 401 | Wrong email/password |
| `authorization_required` | 401 | Missing or invalid token |
| `token_expired` | 401 | Token has expired |
| `invalid_token` | 401 | Invalid token format |
| `user_not_found` | 404 | User doesn't exist |
| `account_inactive` | 403 | Account is deactivated |
| `user_exists` | 409 | User already registered |
| `rate_limited` | 429 | Too many requests |
| `internal_error` | 500 | Server error |

## Endpoints

### Health Check

#### GET `/health`

Basic health check endpoint (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "message": "API is running normally",
  "version": "1.0.0"
}
```

#### GET `/status`

Detailed system status (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "api": "running",
  "database": "connected",
  "auth": "enabled"
}
```

### Authentication

#### POST `/auth/register`

Register a new user account.

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "is_verified": false,
    "created_at": "2023-12-14T10:30:00Z",
    "updated_at": "2023-12-14T10:30:00Z"
  }
}
```

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters with uppercase, lowercase, and digit
- Names minimum 2 characters each

#### POST `/auth/login`

Authenticate user and receive tokens.

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "is_verified": false,
    "created_at": "2023-12-14T10:30:00Z",
    "updated_at": "2023-12-14T10:30:00Z"
  }
}
```

#### POST `/auth/refresh`

Refresh access token using refresh token.

**Rate Limit:** 20 requests per minute  
**Authentication:** Refresh token required

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### GET `/auth/me`

Get current user profile.

**Authentication:** Access token required

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "is_verified": false,
  "created_at": "2023-12-14T10:30:00Z",
  "updated_at": "2023-12-14T10:30:00Z"
}
```

#### POST `/auth/change-password`

Change user password.

**Rate Limit:** 5 requests per minute  
**Authentication:** Access token required

**Request Body:**
```json
{
  "current_password": "CurrentPassword123",
  "new_password": "NewSecurePassword456"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

#### POST `/auth/logout`

Logout user (client should discard tokens).

**Authentication:** Access token required

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

#### POST `/auth/logout/refresh`

Logout using refresh token.

**Authentication:** Refresh token required

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

## Token Usage

### Making Authenticated Requests

Include the access token in the Authorization header:

```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Token Refresh Flow

1. Access token expires
2. API returns 401 error
3. Use refresh token to get new access token
4. Continue making requests with new access token

Example refresh flow:

```javascript
// When API request fails with 401
if (error.status === 401) {
  const refreshResponse = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`
    },
    body: JSON.stringify({
      refresh_token: refreshToken
    })
  });
  
  if (refreshResponse.ok) {
    const { access_token } = await refreshResponse.json();
    // Update stored access token
    localStorage.setItem('access_token', access_token);
    // Retry original request with new token
  }
}
```

### Token Storage Recommendations

**Frontend (React/Angular/Vue):**
```javascript
// Store in memory or httpOnly cookies (recommended)
const accessToken = response.access_token;
const refreshToken = response.refresh_token;

// Never store in localStorage for security
// Consider using secure httpOnly cookies
```

**Mobile Apps:**
```javascript
// Use secure storage mechanisms
const accessToken = await SecureStore.getItemAsync('access_token');
const refreshToken = await SecureStore.getItemAsync('refresh_token');
```

## Examples

### Complete Authentication Flow

```javascript
// 1. Register user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123',
    first_name: 'John',
    last_name: 'Doe'
  })
});

const registerData = await registerResponse.json();
const { access_token, refresh_token } = registerData;

// 2. Store tokens
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// 3. Make authenticated request
const profileResponse = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

const profile = await profileResponse.json();
console.log('User profile:', profile);

// 4. When access token expires, refresh it
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${refresh_token}`
  },
  body: JSON.stringify({
    refresh_token: refresh_token
  })
});

const { access_token: newAccessToken } = await refreshResponse.json();
localStorage.setItem('access_token', newAccessToken);

// 5. Logout when done
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

// Clear stored tokens
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

### Python Example

```python
import requests
import json

API_BASE = 'http://localhost:5000/api'

class AuthAPI:
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        self.base_url = f"{API_BASE}/auth"
    
    def register(self, email, password, first_name, last_name):
        data = {
            'email': email,
            'password': password,
            'first_name': first_name,
            'last_name': last_name
        }
        response = requests.post(f"{self.base_url}/register", json=data)
        if response.status_code == 201:
            result = response.json()
            self.access_token = result['access_token']
            self.refresh_token = result['refresh_token']
            return result
        return response.json()
    
    def login(self, email, password):
        data = {
            'email': email,
            'password': password
        }
        response = requests.post(f"{self.base_url}/login", json=data)
        if response.status_code == 200:
            result = response.json()
            self.access_token = result['access_token']
            self.refresh_token = result['refresh_token']
            return result
        return response.json()
    
    def get_profile(self):
        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = requests.get(f"{self.base_url}/me", headers=headers)
        return response.json()
    
    def refresh_token(self):
        data = {'refresh_token': self.refresh_token}
        headers = {'Authorization': f'Bearer {self.refresh_token}'}
        response = requests.post(f"{self.base_url}/refresh", json=data, headers=headers)
        if response.status_code == 200:
            result = response.json()
            self.access_token = result['access_token']
        return response.json()

# Usage
auth = AuthAPI()
result = auth.register('user@example.com', 'SecurePassword123', 'John', 'Doe')
profile = auth.get_profile()
```

## Security Considerations

1. **Password Security**: Passwords are hashed using Werkzeug's PBKDF2 implementation
2. **Token Security**: Use HTTPS in production to prevent token interception
3. **Rate Limiting**: Implemented to prevent brute force attacks
4. **Input Validation**: All inputs are validated using Pydantic schemas
5. **CORS**: Configured to allow only specified origins
6. **Token Expiry**: Access tokens expire quickly, refresh tokens last longer

## Environment Variables

Set these environment variables for production:

```bash
JWT_SECRET_KEY=your-very-secret-key-change-in-production
CORS_ORIGINS=https://your-domain.com,https://app.your-domain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## Development Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export FLASK_ENV=development
export JWT_SECRET_KEY=dev-secret-key
```

3. Run the application:
```bash
python app.py
```

4. Run tests:
```bash
pytest tests/
```

5. Run with specific config:
```bash
export FLASK_ENV=testing
python -m pytest tests/
```

The API will be available at `http://localhost:5000/api`
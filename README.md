# Ashish Authentication API

A secure, production-ready authentication API built with Flask, implementing JWT-based authentication with access and refresh tokens, comprehensive validation, and rate limiting.

## Features

- 🔐 **JWT Authentication** - Access and refresh token system
- 🛡️ **Secure Password Hashing** - PBKDF2 implementation
- ✅ **Input Validation** - Pydantic schemas for request/response validation
- 🚦 **Rate Limiting** - Prevention of brute force attacks
- 📝 **Comprehensive Testing** - Unit tests for all endpoints
- 📚 **API Documentation** - Complete documentation with examples
- 🌐 **CORS Support** - Configurable cross-origin resource sharing
- 🔧 **Production Ready** - Proper error handling and logging

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ashish-auth-api
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables (optional for development):
```bash
export FLASK_ENV=development
export JWT_SECRET_KEY=your-secret-key-here
```

4. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000/api`

### Running Tests

```bash
pytest tests/ -v
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout/refresh` - Logout with refresh token

### Health Check

- `GET /api/health/health` - Basic health check
- `GET /api/health/status` - Detailed system status

## Configuration

The application supports multiple configuration environments:

- **Development** - Debug mode enabled
- **Production** - Optimized for production use
- **Testing** - In-memory database for tests

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET_KEY` | Secret key for JWT tokens | `your-secret-key-change-in-production` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `http://localhost:3000` |
| `DATABASE_URL` | Database connection string | `sqlite:///app.db` |
| `FLASK_ENV` | Environment (development/production/testing) | `development` |

## Security Features

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

### Rate Limiting

- Registration: 5 requests per minute
- Login: 10 requests per minute
- Token refresh: 20 requests per minute
- Password change: 5 requests per minute
- General: 200 per day, 50 per hour

### Token Management

- **Access Token**: 1 hour expiry
- **Refresh Token**: 30 days expiry
- Automatic token validation
- Proper token expiration handling

## Architecture

```
├── app.py                 # Application factory and configuration
├── config.py             # Configuration management
├── models.py             # Database models
├── schemas.py            # Pydantic validation schemas
├── auth_service.py       # Authentication business logic
├── auth/
│   └── __init__.py       # Auth blueprint with endpoints
├── health/
│   └── __init__.py       # Health check endpoints
├── tests/
│   └── test_auth.py      # Comprehensive test suite
└── API_DOCUMENTATION.md  # Detailed API documentation
```

## Request/Response Examples

### Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "error_type",
  "message": "Human-readable error message",
  "details": ["Specific validation errors"]
}
```

## Testing

The test suite covers:

- ✅ User registration (success/failure cases)
- ✅ User login (valid/invalid credentials)
- ✅ Token refresh functionality
- ✅ Protected route access
- ✅ Password change operations
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling

Run tests with:
```bash
pytest tests/ -v --cov=.
```

## Production Deployment

1. Set production environment variables:
```bash
export FLASK_ENV=production
export JWT_SECRET_KEY=your-production-secret-key
export DATABASE_URL=postgresql://user:pass@localhost/db
```

2. Use a production WSGI server:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

3. Configure reverse proxy (nginx):
```nginx
location /api/ {
    proxy_pass http://localhost:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

For issues and questions, please open an issue in the repository.
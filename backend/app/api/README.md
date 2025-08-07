# Broadcast Management System API

This Django REST Framework API provides all the endpoints needed by the frontend application running at app.capparelli.ie.

## Authentication Endpoints

The API uses session-based authentication with CSRF protection.

- `GET /api/csrf/` - Get a CSRF token for making authenticated requests
- `POST /api/auth/login/` - Login with username/password
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/user/` - Get current user information

### Authentication Flow

1. Get a CSRF token from `/api/csrf/`
2. Include the CSRF token in the header of your login request to `/api/auth/login/`
3. Upon successful login, the server will set a session cookie
4. For all subsequent requests, include both the session cookie and CSRF token

## Data Endpoints

All data endpoints require authentication and follow REST conventions (GET, POST, PUT, DELETE).

### Resource Endpoints

- `/api/profiles/` - User profiles with job information
- `/api/locations/` - Physical locations
- `/api/facilities/` - Facilities within locations
- `/api/shifts/` - Shift definitions

### Incident Management

- `/api/incident-types/` - Types of incidents
- `/api/incident-tickets/` - Incident tickets
- `/api/service-tickets/` - Service tickets

### Time Management

- `/api/time-entries/` - Time clock entries
- `/api/scheduled-events/` - Scheduled events
- `/api/time-off-requests/` - Time off requests

### Email Functionality

- `POST /api/send-email/` - Send emails (requires authentication)

## Request/Response Format

All endpoints accept and return JSON data.

### Example: Login

Request:

```http
POST /api/auth/login/
Content-Type: application/json
X-CSRFToken: <csrf_token_from_csrf_endpoint>

{
  "username": "user@example.com",
  "password": "secure_password"
}
```

Response:

```json
{
  "id": 1,
  "username": "user@example.com",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_staff": false
}
```

## Filtering Data

Many endpoints support filtering:

- Time entries: `?user_id=1`
- Scheduled events: `?user_id=1&start_date=2023-01-01&end_date=2023-01-31`
- Time off requests: `?user_id=1`

## Pagination

All list endpoints are paginated with 20 items per page by default. Use `?page=2` to get the next page of results.

## Error Handling

Errors are returned with appropriate HTTP status codes and descriptive messages:

```json
{
  "error": "Invalid credentials"
}
```

## Development Setup

To set up the API for development:

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Apply migrations
5. Start the development server

For detailed instructions, see the main README.md file.

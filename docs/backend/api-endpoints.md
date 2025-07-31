# API Endpoints Design

## Overview

This document outlines the REST API endpoints that will be implemented for the Broadcast Management System backend. The API is designed to match the expectations of the existing frontend application.

## Base URL

All API endpoints will be prefixed with `/api/`.

## Authentication Endpoints

### User Authentication

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/auth/login/` | POST | Authenticate user | `{ "username": string, "password": string }` | User object with auth token |
| `/api/auth/logout/` | POST | Log out user | None | `{ "detail": "Successfully logged out" }` |
| `/api/auth/user/` | GET | Get current authenticated user | None | User object |
| `/api/csrf/` | GET | Get CSRF token | None | `{ "csrfToken": string }` |

## User and Profile Management

### Users

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/users/` | GET | List users | None | List of user objects with pagination |
| `/api/users/:id/` | GET | Get user details | None | User object |
| `/api/users/:id/` | PATCH | Update user | User fields to update | Updated user object |

### Profiles

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/profiles/` | GET | List profiles | None | List of profile objects with pagination |
| `/api/profiles/:id/` | GET | Get profile details | None | Profile object |
| `/api/profiles/` | POST | Create profile | Profile fields | Created profile object |
| `/api/profiles/:id/` | PATCH | Update profile | Profile fields to update | Updated profile object |

## Location Management

### Locations

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/locations/` | GET | List locations | None | List of location objects with pagination |
| `/api/locations/:id/` | GET | Get location details | None | Location object |
| `/api/locations/` | POST | Create location | Location fields | Created location object |
| `/api/locations/:id/` | PATCH | Update location | Location fields to update | Updated location object |

### Facilities

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/facilities/` | GET | List facilities | None | List of facility objects with pagination |
| `/api/facilities/:id/` | GET | Get facility details | None | Facility object |
| `/api/facilities/` | POST | Create facility | Facility fields | Created facility object |
| `/api/facilities/:id/` | PATCH | Update facility | Facility fields to update | Updated facility object |

## Shift Management

### Shifts

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/shifts/` | GET | List shifts | None | List of shift objects |
| `/api/shifts/:id/` | GET | Get shift details | None | Shift object |
| `/api/shifts/` | POST | Create shift | Shift fields | Created shift object |
| `/api/shifts/:id/` | PATCH | Update shift | Shift fields to update | Updated shift object |

## Time Tracking

### Time Entries

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/time-entries/` | GET | List time entries | Optional: `?user=id` | List of time entry objects with pagination |
| `/api/time-entries/:id/` | GET | Get time entry details | None | Time entry object |
| `/api/time-entries/` | POST | Create time entry | Time entry fields | Created time entry object |
| `/api/time-entries/:id/` | PATCH | Update time entry | Time entry fields to update | Updated time entry object |

### Time Off Requests

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/time-off-requests/` | GET | List time off requests | Optional: `?user=id` | List of time off request objects with pagination |
| `/api/time-off-requests/:id/` | GET | Get time off request details | None | Time off request object |
| `/api/time-off-requests/` | POST | Create time off request | Time off request fields | Created time off request object |
| `/api/time-off-requests/:id/` | PATCH | Update time off request | Time off request fields to update | Updated time off request object |

## Scheduling

### Scheduled Events

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/scheduled-events/` | GET | List scheduled events | Optional: `?start_date=yyyy-mm-dd&end_date=yyyy-mm-dd` | List of scheduled event objects with pagination |
| `/api/scheduled-events/:id/` | GET | Get scheduled event details | None | Scheduled event object |
| `/api/scheduled-events/` | POST | Create scheduled event | Scheduled event fields | Created scheduled event object |
| `/api/scheduled-events/:id/` | PATCH | Update scheduled event | Scheduled event fields to update | Updated scheduled event object |
| `/api/scheduled-events/:id/` | DELETE | Delete scheduled event | None | `{ "detail": "Event deleted" }` |

## Incident Management

### Incident Types

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/incident-types/` | GET | List incident types | None | List of incident type objects |
| `/api/incident-types/:id/` | GET | Get incident type details | None | Incident type object |
| `/api/incident-types/` | POST | Create incident type | Incident type fields | Created incident type object |
| `/api/incident-types/:id/` | PATCH | Update incident type | Incident type fields to update | Updated incident type object |

### Incident Tickets

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/incident-tickets/` | GET | List incident tickets | Optional: `?status=new` | List of incident ticket objects with pagination |
| `/api/incident-tickets/:id/` | GET | Get incident ticket details | None | Incident ticket object |
| `/api/incident-tickets/` | POST | Create incident ticket | Incident ticket fields | Created incident ticket object |
| `/api/incident-tickets/:id/` | PATCH | Update incident ticket | Incident ticket fields to update | Updated incident ticket object |

## Service Management

### Service Tickets

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/service-tickets/` | GET | List service tickets | Optional: `?status=new` | List of service ticket objects with pagination |
| `/api/service-tickets/:id/` | GET | Get service ticket details | None | Service ticket object |
| `/api/service-tickets/` | POST | Create service ticket | Service ticket fields | Created service ticket object |
| `/api/service-tickets/:id/` | PATCH | Update service ticket | Service ticket fields to update | Updated service ticket object |

## Equipment Management

### Equipment Categories

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/equipment-categories/` | GET | List equipment categories | None | List of equipment category objects |
| `/api/equipment-categories/:id/` | GET | Get equipment category details | None | Equipment category object |
| `/api/equipment-categories/` | POST | Create equipment category | Equipment category fields | Created equipment category object |
| `/api/equipment-categories/:id/` | PATCH | Update equipment category | Equipment category fields to update | Updated equipment category object |

### Equipment

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/equipment/` | GET | List equipment | Optional: `?status=available` | List of equipment objects with pagination |
| `/api/equipment/:id/` | GET | Get equipment details | None | Equipment object |
| `/api/equipment/` | POST | Create equipment | Equipment fields | Created equipment object |
| `/api/equipment/:id/` | PATCH | Update equipment | Equipment fields to update | Updated equipment object |

## Communication

### Comments

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/comments/` | GET | List comments | Required: `?content_type=id&object_id=id` | List of comment objects |
| `/api/comments/:id/` | GET | Get comment details | None | Comment object |
| `/api/comments/` | POST | Create comment | Comment fields including content type and object ID | Created comment object |
| `/api/comments/:id/` | PATCH | Update comment | Comment fields to update | Updated comment object |
| `/api/comments/:id/` | DELETE | Delete comment | None | `{ "detail": "Comment deleted" }` |

### Notifications

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/notifications/` | GET | List notifications for current user | Optional: `?is_read=false` | List of notification objects with pagination |
| `/api/notifications/:id/` | GET | Get notification details | None | Notification object |
| `/api/notifications/:id/mark-read/` | POST | Mark notification as read | None | Updated notification object |
| `/api/notifications/mark-all-read/` | POST | Mark all notifications as read | None | `{ "detail": "All notifications marked as read" }` |

## Utility Endpoints

### Email

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/send-email/` | POST | Send email | `{ "to": [string], "subject": string, "message": string, "html": string }` | `{ "detail": "Email sent" }` |

## Response Format

### Successful Responses

For list endpoints, the response format will be:

```json
{
  "count": 100,
  "next": "http://example.com/api/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "user1",
      // other fields...
    },
    // more items...
  ]
}
```

For detail endpoints, the response will be the object itself:

```json
{
  "id": 1,
  "username": "user1",
  // other fields...
}
```

### Error Responses

Error responses will follow this format:

```json
{
  "detail": "Error message",
  "code": "error_code"
}
```

For validation errors:

```json
{
  "field1": ["Error message 1", "Error message 2"],
  "field2": ["Error message 3"]
}
```

## Filtering and Pagination

Most list endpoints will support:

1. **Pagination** - Via query parameters `?page=1&page_size=10`
2. **Filtering** - Via field-specific query parameters (e.g., `?status=active`)
3. **Searching** - Via a search parameter `?search=term`
4. **Ordering** - Via an ordering parameter `?ordering=field` or `?ordering=-field` for descending

## Authentication and Permissions

The API will use Django's session-based authentication with CSRF protection. All API endpoints except for login and CSRF token will require authentication.

Permissions will be role-based, following these general rules:

1. **Administrators** - Full access to all endpoints
2. **Managers** - Access to most endpoints with some restrictions on sensitive operations
3. **Schedulers** - Access to scheduling-related endpoints and read access to most other data
4. **Operators** - Limited access primarily to endpoints related to their own data and operations

## API Versioning

The API will be versioned to allow for future changes without breaking existing clients. Initially, version 1 will be implicit, but future versions may use an explicit version prefix (e.g., `/api/v2/`).

## Rate Limiting

Rate limiting will be applied to prevent abuse:

1. **Anonymous users** - 20 requests per minute
2. **Authenticated users** - 60 requests per minute
3. **Staff users** - 120 requests per minute

## Example Requests and Responses

### Login Example

Request:
```
POST /api/auth/login/
Content-Type: application/json

{
  "username": "john.doe",
  "password": "securepassword"
}
```

Response:
```
Status: 200 OK
Content-Type: application/json

{
  "id": 1,
  "username": "john.doe",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "is_active": true
}
```

### Creating a Time Entry Example

Request:
```
POST /api/time-entries/
Content-Type: application/json
X-CSRFToken: abcdef123456

{
  "date": "2023-07-15",
  "start_time": "09:00:00",
  "end_time": "17:30:00",
  "shift": 2,
  "notes": "Regular workday"
}
```

Response:
```
Status: 201 Created
Content-Type: application/json

{
  "id": 42,
  "user": {
    "id": 1,
    "username": "john.doe",
    "first_name": "John",
    "last_name": "Doe"
  },
  "date": "2023-07-15",
  "start_time": "09:00:00",
  "end_time": "17:30:00",
  "shift": 2,
  "notes": "Regular workday",
  "status": "pending",
  "created_at": "2023-07-15T17:35:22Z",
  "updated_at": "2023-07-15T17:35:22Z"
}
```

## API Documentation

The API will be documented using drf-yasg (Yet Another Swagger Generator) which provides an interactive API documentation interface based on Swagger/OpenAPI.

The documentation will be available at:

- `/api/docs/` - Swagger UI for interactive documentation
- `/api/redoc/` - ReDoc alternative documentation view
- `/api/schema/` - OpenAPI schema in JSON format

## Conclusion

This API design provides a comprehensive foundation for the Broadcast Management System backend. The endpoints are structured to support the existing frontend application while following RESTful best practices. The authentication system and permission controls ensure secure access to the system's functionality. 
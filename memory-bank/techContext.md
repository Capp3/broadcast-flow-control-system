# Technical Context

## Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui with Radix UI primitives
- **Router**: React Router v6
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Date Handling**: date-fns
- **Charts/Visualizations**: Recharts
- **Toast Notifications**: Sonner and Radix UI Toast

## Current API Structure

The frontend is currently set up to work with a Django backend API, but it's working well without an actual backend. The current API service has endpoints for:

- Authentication (login, logout, current user)
- User profiles
- Locations and facilities
- Shifts management
- Incident and service tickets
- Time entries
- Scheduled events
- Time off requests
- Email functionality

The API expects a REST structure with standard CRUD operations and pagination for list endpoints.

## Authentication Flow

Currently implemented with:
- Session-based authentication with CSRF token handling
- Login/logout functionality
- Protected routes with user context
- Role-based UI adjustments

## Existing Components

- Layout with sidebar navigation
- Dashboard with analytics cards
- Forms for various data entry screens
- Tables for data display
- Calendar views for scheduling
- Modal dialogs for quick actions

## Key Requirements to Preserve

1. Maintain the current UI/UX
2. Preserve authentication flow
3. Keep the same routing structure
4. Ensure data fetching patterns remain consistent

## Areas for Backend Development

The backend will need to implement:
1. RESTful API endpoints matching the current frontend expectations
2. Authentication system compatible with the frontend's approach
3. Database schema supporting all entity types
4. Business logic for complex operations 
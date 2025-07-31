# System Patterns

## Frontend Patterns

### Component Structure

The application follows a standard React component hierarchy:
- App component as the root
- Layout component for page structure
- Page components for different routes
- Reusable UI components from shadcn/ui
- Custom components for specific functionality

### Data Flow

- React Context for global state management
- Props for component-specific data passing
- React Query for data fetching and caching
- Form state managed through React Hook Form

### Routing

- React Router v6 with route protection via ProtectedRoute component
- Nested routes within the Layout component
- Route-specific components loaded based on URL path

### Authentication

- Context-based auth state management
- Token-based authentication expected with the API
- Protection of routes based on authentication state

### Error Handling

- Toast notifications for user feedback
- Error boundaries for component failures
- Try-catch patterns in API calls

## API Patterns

### Request Structure

- RESTful endpoints
- JSON data format
- CSRF token for non-GET requests
- Credentials included for session-based auth

### Response Structure

- Standardized API responses
- Pagination for list endpoints
- Error details included in error responses

### Authentication Flow

- Login endpoint for credentials
- Session-based authentication with CSRF protection
- User details endpoint for current user information

## UI Patterns

### Layout

- Sidebar navigation with responsive design
- Content area with appropriate padding
- Header with user information and actions

### Forms

- Consistent field layout
- Validation with error messages
- Submit and cancel actions
- Loading states during submission

### Data Display

- Tables for list views
- Cards for summary information
- Modal dialogs for detailed views or quick edits

### Feedback

- Toast notifications for actions
- Loading indicators for async operations
- Clear error messages for form validation 
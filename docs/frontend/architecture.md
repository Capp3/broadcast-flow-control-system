# Frontend Architecture

The Broadcast Management System frontend is built with React 18, TypeScript, and modern development tools. This document provides a comprehensive overview of the architecture, design patterns, and component structure.

## Overview

The frontend is a single-page application (SPA) built with React that provides a complete user interface for broadcast management operations. It's designed to work independently of a backend during development and seamlessly integrate with a Django REST API in production.

## Technology Stack

### Core Technologies
- **React 18**: Component-based UI library with Hooks
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **React Router v6**: Client-side routing

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library built on Radix UI
- **Radix UI**: Primitive components for accessibility
- **Lucide React**: Modern icon library

### State Management
- **React Context API**: Global state management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utilities
- **Sonner**: Toast notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── reports/        # Report-specific components
│   └── scheduling/     # Scheduling-specific components
├── pages/              # Main application pages
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Architecture Patterns

### Component Architecture

```mermaid
graph TD
    App[App.tsx<br/>Root Component]
    
    subgraph "Providers"
        Auth[AuthProvider]
        Query[QueryClientProvider]
        Router[BrowserRouter]
        Settings[SettingsProvider]
    end
    
    subgraph "Layout"
        Layout[Layout Component]
        Sidebar[Sidebar Navigation]
        Header[Header Bar]
    end
    
    subgraph "Pages"
        Dashboard[Dashboard]
        TimeKeeping[Time Keeping]
        Scheduling[Scheduling]
        Reports[Reports]
        Settings_Page[Settings]
    end
    
    subgraph "Components"
        Forms[Form Components]
        Tables[Data Tables]
        Dialogs[Modal Dialogs]
        UI[UI Components]
    end
    
    App --> Auth
    Auth --> Query
    Query --> Router
    Router --> Layout
    Layout --> Sidebar
    Layout --> Header
    Layout --> Dashboard
    Layout --> TimeKeeping
    Layout --> Scheduling
    Layout --> Reports
    Layout --> Settings_Page
    
    Dashboard --> Forms
    TimeKeeping --> Tables
    Scheduling --> Dialogs
    Reports --> UI
```

### Data Flow

The application follows a unidirectional data flow pattern:

1. **User Actions** → Trigger events in components
2. **Components** → Update local state or call API services
3. **Services** → Make HTTP requests to backend APIs
4. **Context/Query** → Manage global state and cache responses
5. **Components** → Re-render with updated data

### Routing Architecture

```typescript
// Route structure with protection and layout
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    } />
    // ... other routes
  </Routes>
</BrowserRouter>
```

## Core Components

### App Component
The root component that sets up providers and routing:

```typescript
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            {/* Route definitions */}
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
```

### Layout System
The layout provides consistent structure across all pages:

- **Sidebar Navigation**: Collapsible navigation menu
- **Header Bar**: User info, notifications, logout
- **Main Content**: Page-specific content area
- **Protected Routes**: Authentication-based access control

### State Management Strategy

#### 1. Authentication State (React Context)
```typescript
interface AuthContextType {
  user: DjangoUser | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
```

#### 2. Settings State (React Context)
```typescript
interface SettingsContextType {
  locations: Location[];
  facilities: Facility[];
  shifts: Shift[];
  incidentTypes: IncidentType[];
  // CRUD operations
}
```

#### 3. Server State (TanStack Query)
```typescript
// Example query hook
const useIncidentTickets = () => {
  return useQuery({
    queryKey: ['incident-tickets'],
    queryFn: () => djangoApi.getIncidentTickets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## Component Categories

### 1. Layout Components
- **Layout**: Main application layout wrapper
- **Sidebar**: Navigation sidebar with menu items
- **ProtectedRoute**: Authentication wrapper for routes

### 2. Page Components
- **Dashboard**: Analytics and overview page
- **TimeKeeping**: Time tracking and approval
- **Scheduling**: Event and shift scheduling
- **EmployeeManagement**: User and profile management
- **Reports**: Data visualization and exports
- **Settings**: System configuration

### 3. Form Components
- **ClockEntryForm**: Time clock interface
- **TimeOffRequestForm**: Time-off request submission
- **IncidentReportForm**: Incident reporting
- **AddEmployeeDialog**: User creation modal

### 4. Data Display Components
- **TicketDetail**: Ticket information display
- **MonthlyTimeCalendar**: Calendar view for time entries
- **TimeClockApproval**: Time entry approval interface
- **TicketReview**: Ticket review and approval

### 5. UI Components (shadcn/ui)
- **Button**: Customizable button components
- **Input**: Form input components
- **Dialog**: Modal dialog components
- **Table**: Data table components
- **Card**: Content container components

## API Integration

### Service Layer Architecture
The service layer abstracts API communication:

```typescript
class DjangoApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Handle authentication, CSRF, error handling
  }
  
  async getIncidentTickets(): Promise<ApiResponse<IncidentTicket>> {
    return this.request<ApiResponse<IncidentTicket>>('/incident-tickets/');
  }
  
  // ... other API methods
}

export const djangoApi = new DjangoApiService();
```

### Authentication Integration
The frontend is ready for session-based authentication:

```typescript
// CSRF token handling
const getCsrfToken = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/csrf/`, {
    credentials: 'include',
  });
  const data = await response.json();
  return data.csrfToken;
};

// Session-based requests
const config: RequestInit = {
  credentials: 'include', // Include session cookies
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken, // CSRF protection
  },
};
```

## Type Safety

### TypeScript Configuration
The project uses strict TypeScript configuration for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions
All data structures are defined in `src/types/django.ts`:

```typescript
export interface DjangoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
}

export interface Profile {
  id: number;
  user: DjangoUser;
  full_name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  // ... other fields
}
```

## Performance Optimizations

### Code Splitting
The application uses React.lazy for route-based code splitting:

```typescript
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const TimeKeeping = React.lazy(() => import('./pages/TimeKeeping'));
```

### Query Optimization
TanStack Query provides intelligent caching and background updates:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Bundle Optimization
Vite provides automatic code splitting and tree shaking for optimal bundle sizes.

## Error Handling

### Global Error Boundaries
Error boundaries catch and handle component errors:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Component error:', error, errorInfo);
  }
}
```

### API Error Handling
The service layer provides consistent error handling:

```typescript
if (!response.ok) {
  const errorData: ApiError = await response.json().catch(() => ({}));
  throw new Error(errorData.detail || `HTTP ${response.status}`);
}
```

## Development Workflow

### Hot Module Replacement
Vite provides fast HMR for instant development feedback.

### Type Checking
TypeScript compilation ensures type safety during development.

### Linting and Formatting
ESLint and Prettier maintain code quality and consistency.

## Testing Strategy

### Component Testing
React Testing Library for component behavior testing.

### Type Testing
TypeScript compiler catches type-related issues.

### Integration Testing
End-to-end testing with real API interactions.

## Future Considerations

### Backend Integration
The frontend is designed to seamlessly integrate with the planned Django backend:

- Session-based authentication ready
- API service layer matches backend endpoints
- Type definitions align with Django models
- Error handling supports backend error formats

### Scalability
The architecture supports future enhancements:

- Modular component structure
- Extensible service layer
- Flexible state management
- Performance optimization ready

### Progressive Web App
The foundation exists for PWA features:

- Service worker ready
- Offline-first architecture possible
- Push notification support ready 
# TypeScript Types

This document provides comprehensive documentation of all TypeScript interfaces and types used in the Broadcast Management System frontend. These types define the data structures that the frontend expects from the backend API.

## Overview

All type definitions are centralized in `src/types/django.ts` and follow a consistent naming convention that reflects the Django backend models. These types ensure type safety throughout the application and provide clear contracts for API integration.

## Core User Types

### DjangoUser
The primary user interface representing authenticated users in the system.

```typescript
export interface DjangoUser {
  id: number;                    // Unique user identifier
  username: string;              // Login username
  email: string;                 // User email address
  first_name: string;            // User's first name
  last_name: string;             // User's last name
  is_staff: boolean;             // Staff privileges flag
  is_active: boolean;            // Account active status
  date_joined: string;           // ISO date string of account creation
  last_login: string | null;     // ISO date string of last login
}
```

**Usage**: Core user authentication and identification throughout the application.

### Profile
Extended user profile information with business-specific details.

```typescript
export interface Profile {
  id: number;                    // Profile identifier
  user: DjangoUser;              // Associated user account
  full_name: string;             // Display name
  email: string;                 // Profile email (may differ from user email)
  phone?: string;                // Phone number (optional)
  position?: string;             // Job position/title
  department?: string;           // Department assignment
  start_date?: string;           // Employment start date
  status: 'Active' | 'Inactive'; // Employment status
  created_at: string;            // Profile creation date
  updated_at: string;            // Last update timestamp
}
```

**Usage**: Employee management, profile display, and business logic throughout the application.

---

## Location and Facility Types

### Location
Physical locations where broadcast operations occur.

```typescript
export interface Location {
  id: number;                    // Location identifier
  name: string;                  // Location name/title
  description?: string;          // Optional location description
  created_at: string;            // Creation timestamp
}
```

**Usage**: Event scheduling, time tracking, and facility management.

### Facility
Specific facilities or areas within locations.

```typescript
export interface Facility {
  id: number;                    // Facility identifier
  name: string;                  // Facility name
  description?: string;          // Facility description
  location?: Location;           // Associated location
  status: 'Active' | 'Inactive'; // Facility operational status
  created_at: string;            // Creation timestamp
}
```

**Usage**: Resource scheduling and facility management workflows.

---

## Scheduling Types

### Shift
Work shift definitions for scheduling and time tracking.

```typescript
export interface Shift {
  id: number;                    // Shift identifier
  name: string;                  // Shift name (e.g., "Morning", "Evening")
  description?: string;          // Shift description
  start_time?: string;           // Shift start time (HH:MM format)
  end_time?: string;             // Shift end time (HH:MM format)
  created_at: string;            // Creation timestamp
}
```

**Usage**: Employee scheduling, time tracking, and shift management.

### ScheduledEvent
Events scheduled in the broadcast calendar.

```typescript
export interface ScheduledEvent {
  id: number;                    // Event identifier
  title: string;                 // Event title
  description?: string;          // Event description
  event_type?: string;           // Event category
  start_time: string;            // ISO datetime string
  end_time: string;              // ISO datetime string
  location?: Location;           // Event location
  assigned_users: Profile[];     // Assigned staff members
  created_by?: Profile;          // Event creator
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  created_at: string;            // Creation timestamp
  updated_at: string;            // Last update timestamp
}
```

**Usage**: Calendar displays, scheduling interfaces, and event management.

---

## Time Tracking Types

### TimeEntry
Individual time tracking records for employees.

```typescript
export interface TimeEntry {
  id: number;                    // Time entry identifier
  user: Profile;                 // Employee profile
  date: string;                  // Entry date (YYYY-MM-DD)
  clock_in?: string;             // Clock-in time (ISO string)
  clock_out?: string;            // Clock-out time (ISO string)
  break_start?: string;          // Break start time (ISO string)
  break_end?: string;            // Break end time (ISO string)
  total_hours?: number;          // Calculated total hours
  location?: Location;           // Work location
  shift?: Shift;                 // Associated shift
  notes?: string;                // Additional notes
  status: 'Pending' | 'Approved' | 'Rejected'; // Approval status
  approved_by?: Profile;         // Approving manager
  approved_at?: string;          // Approval timestamp
  created_at: string;            // Creation timestamp
  updated_at: string;            // Last update timestamp
}
```

**Usage**: Time tracking interfaces, payroll processing, and manager approval workflows.

### TimeOffRequest
Employee time-off requests with approval workflow.

```typescript
export interface TimeOffRequest {
  id: number;                    // Request identifier
  user: Profile;                 // Requesting employee
  request_type: string;          // Type of time off (vacation, sick, etc.)
  start_date: string;            // Start date (YYYY-MM-DD)
  end_date: string;              // End date (YYYY-MM-DD)
  reason?: string;               // Request reason/notes
  status: 'Pending' | 'Approved' | 'Rejected'; // Request status
  approved_by?: Profile;         // Approving manager
  approved_at?: string;          // Approval timestamp
  created_at: string;            // Creation timestamp
  updated_at: string;            // Last update timestamp
}
```

**Usage**: Time-off management, scheduling conflict detection, and approval workflows.

---

## Ticket Management Types

### IncidentType
Categorization for incident tickets.

```typescript
export interface IncidentType {
  id: number;                    // Type identifier
  name: string;                  // Type name
  description?: string;          // Type description
  severity_level: number;        // Severity level (1-5, 1 being highest)
  created_at: string;            // Creation timestamp
}
```

**Usage**: Incident classification and reporting workflows.

### IncidentTicket
Incident reports and tracking.

```typescript
export interface IncidentTicket {
  id: number;                    // Incident identifier
  title: string;                 // Incident title
  description?: string;          // Detailed description
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  incident_type?: IncidentType;  // Incident classification
  reporter?: Profile;            // Person reporting the incident
  assignee?: Profile;            // Assigned responder
  facility?: Facility;           // Affected facility
  created_at: string;            // Report timestamp
  updated_at: string;            // Last update timestamp
  resolved_at?: string;          // Resolution timestamp
}
```

**Usage**: Incident reporting, tracking, and resolution workflows.

### ServiceTicket
Service requests and change management.

```typescript
export interface ServiceTicket {
  id: number;                    // Service ticket identifier
  title: string;                 // Request title
  description?: string;          // Request description
  service_type?: string;         // Type of service requested
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  requested_by?: Profile;        // Person making the request
  assignee?: Profile;            // Assigned service provider
  due_date?: string;             // Requested completion date
  created_at: string;            // Request timestamp
  updated_at: string;            // Last update timestamp
  completed_at?: string;         // Completion timestamp
}
```

**Usage**: Service request management and change control processes.

---

## API Response Types

### ApiResponse<T>
Generic response wrapper for paginated API responses.

```typescript
export interface ApiResponse<T> {
  results?: T[];                 // Array of result objects
  count?: number;                // Total number of items
  next?: string;                 // URL for next page
  previous?: string;             // URL for previous page
  data?: T;                      // Single result object
}
```

**Usage**: Standardized API response handling with pagination support.

**Example Usage**:
```typescript
// List endpoint response
const response: ApiResponse<Profile> = {
  results: [...profiles],
  count: 150,
  next: "https://api.example.com/profiles/?page=2",
  previous: null
};

// Detail endpoint response
const response: ApiResponse<Profile> = {
  data: profile
};
```

### ApiError
Standardized error response structure.

```typescript
export interface ApiError {
  detail?: string;               // General error message
  message?: string;              // Alternative message field
  errors?: Record<string, string[]>; // Field-specific validation errors
}
```

**Usage**: Consistent error handling across all API interactions.

**Example Usage**:
```typescript
// General error
const error: ApiError = {
  detail: "Authentication required"
};

// Validation errors
const error: ApiError = {
  errors: {
    email: ["This field is required"],
    password: ["Password must be at least 8 characters"]
  }
};
```

---

## Type Usage Patterns

### Form Types
Types are used extensively with React Hook Form for type-safe form handling:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema based on TypeScript interface
const timeEntrySchema = z.object({
  date: z.string(),
  clock_in: z.string().optional(),
  clock_out: z.string().optional(),
  notes: z.string().optional(),
});

type TimeEntryFormData = z.infer<typeof timeEntrySchema>;

// Type-safe form usage
const form = useForm<TimeEntryFormData>({
  resolver: zodResolver(timeEntrySchema)
});
```

### API Service Types
Types provide contracts for API service methods:

```typescript
class DjangoApiService {
  async getIncidentTickets(): Promise<ApiResponse<IncidentTicket>> {
    return this.request<ApiResponse<IncidentTicket>>('/incident-tickets/');
  }
  
  async createTimeEntry(data: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.request<TimeEntry>('/time-entries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

### Query Types
Types integrate with TanStack Query for type-safe data fetching:

```typescript
const useProfiles = () => {
  return useQuery<ApiResponse<Profile>, ApiError>({
    queryKey: ['profiles'],
    queryFn: () => djangoApi.getProfiles(),
  });
};
```

## Type Safety Benefits

### Compile-Time Validation
TypeScript ensures type correctness during development:

```typescript
// ✅ Type-safe property access
const userName = user.username;

// ❌ Compile error for typos
const userName = user.usernmae; // Property 'usernmae' does not exist

// ✅ Type-safe function calls
await djangoApi.createTimeEntry({ date: '2023-07-15' });

// ❌ Compile error for wrong types
await djangoApi.createTimeEntry({ date: 123 }); // Type 'number' is not assignable
```

### IntelliSense Support
IDE auto-completion and documentation:

- Property suggestions
- Method signature hints
- Inline documentation
- Refactoring support

### Runtime Safety
Combined with Zod validation for runtime type checking:

```typescript
const profileSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  email: z.string().email(),
  status: z.enum(['Active', 'Inactive']),
});

// Runtime validation
const validatedProfile = profileSchema.parse(apiResponse);
```

## Future Type Considerations

### Backend Alignment
Types are designed to align with planned Django backend models:

- Field names match Django model conventions
- Optional fields reflect database nullable fields
- Enum values match Django choices
- Relationship structures follow Django foreign key patterns

### Extensibility
Type definitions support future enhancements:

- Optional fields for backward compatibility
- Union types for status values
- Generic types for reusable patterns
- Modular type organization

### Validation Integration
Types work seamlessly with validation libraries:

- Zod schemas for runtime validation
- React Hook Form integration
- Custom validation rules
- Error message localization support 
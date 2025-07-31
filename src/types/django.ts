// Django API Types
export interface DjangoUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface Profile {
  id: number;
  user: DjangoUser;
  full_name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  start_date?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Facility {
  id: number;
  name: string;
  description?: string;
  location?: Location;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Shift {
  id: number;
  name: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

export interface IncidentType {
  id: number;
  name: string;
  description?: string;
  severity_level: number;
  created_at: string;
}

export interface IncidentTicket {
  id: number;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  incident_type?: IncidentType;
  reporter?: Profile;
  assignee?: Profile;
  facility?: Facility;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface ServiceTicket {
  id: number;
  title: string;
  description?: string;
  service_type?: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  requested_by?: Profile;
  assignee?: Profile;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TimeEntry {
  id: number;
  user: Profile;
  date: string;
  clock_in?: string;
  clock_out?: string;
  break_start?: string;
  break_end?: string;
  total_hours?: number;
  location?: Location;
  shift?: Shift;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: Profile;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledEvent {
  id: number;
  title: string;
  description?: string;
  event_type?: string;
  start_time: string;
  end_time: string;
  location?: Location;
  assigned_users: Profile[];
  created_by?: Profile;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface TimeOffRequest {
  id: number;
  user: Profile;
  request_type: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: Profile;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string;
  previous?: string;
  data?: T;
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
import { 
  DjangoUser, 
  Profile, 
  Location, 
  Facility, 
  Shift, 
  IncidentType, 
  IncidentTicket, 
  ServiceTicket, 
  TimeEntry, 
  ScheduledEvent, 
  TimeOffRequest,
  ApiResponse,
  ApiError 
} from '@/types/django';

const API_BASE_URL = 'https://app.capparelli.ie/api';

// CSRF token handling for Django
let csrfToken: string | null = null;

const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  const response = await fetch(`${API_BASE_URL}/csrf/`, {
    credentials: 'include',
  });
  
  if (response.ok) {
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken!;
  }
  
  throw new Error('Failed to get CSRF token');
};

class DjangoApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add CSRF token for non-GET requests
    if (options.method && options.method !== 'GET') {
      const token = await getCsrfToken();
      defaultHeaders['X-CSRFToken'] = token;
    }

    const config: RequestInit = {
      credentials: 'include', // Important for session-based auth
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(username: string, password: string): Promise<DjangoUser> {
    return this.request<DjangoUser>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout/', { method: 'POST' });
    csrfToken = null; // Clear cached token
  }

  async getCurrentUser(): Promise<DjangoUser> {
    return this.request<DjangoUser>('/auth/user/');
  }

  // Profiles
  async getProfiles(): Promise<ApiResponse<Profile>> {
    return this.request<ApiResponse<Profile>>('/profiles/');
  }

  async getProfile(id: number): Promise<Profile> {
    return this.request<Profile>(`/profiles/${id}/`);
  }

  async createProfile(data: Partial<Profile>): Promise<Profile> {
    return this.request<Profile>('/profiles/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfile(id: number, data: Partial<Profile>): Promise<Profile> {
    return this.request<Profile>(`/profiles/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Locations
  async getLocations(): Promise<ApiResponse<Location>> {
    return this.request<ApiResponse<Location>>('/locations/');
  }

  async createLocation(data: Partial<Location>): Promise<Location> {
    return this.request<Location>('/locations/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Facilities
  async getFacilities(): Promise<ApiResponse<Facility>> {
    return this.request<ApiResponse<Facility>>('/facilities/');
  }

  async createFacility(data: Partial<Facility>): Promise<Facility> {
    return this.request<Facility>('/facilities/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Shifts
  async getShifts(): Promise<ApiResponse<Shift>> {
    return this.request<ApiResponse<Shift>>('/shifts/');
  }

  async createShift(data: Partial<Shift>): Promise<Shift> {
    return this.request<Shift>('/shifts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Incident Types
  async getIncidentTypes(): Promise<ApiResponse<IncidentType>> {
    return this.request<ApiResponse<IncidentType>>('/incident-types/');
  }

  // Incident Tickets
  async getIncidentTickets(): Promise<ApiResponse<IncidentTicket>> {
    return this.request<ApiResponse<IncidentTicket>>('/incident-tickets/');
  }

  async getIncidentTicket(id: number): Promise<IncidentTicket> {
    return this.request<IncidentTicket>(`/incident-tickets/${id}/`);
  }

  async createIncidentTicket(data: Partial<IncidentTicket>): Promise<IncidentTicket> {
    return this.request<IncidentTicket>('/incident-tickets/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateIncidentTicket(id: number, data: Partial<IncidentTicket>): Promise<IncidentTicket> {
    return this.request<IncidentTicket>(`/incident-tickets/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Service Tickets
  async getServiceTickets(): Promise<ApiResponse<ServiceTicket>> {
    return this.request<ApiResponse<ServiceTicket>>('/service-tickets/');
  }

  async getServiceTicket(id: number): Promise<ServiceTicket> {
    return this.request<ServiceTicket>(`/service-tickets/${id}/`);
  }

  async createServiceTicket(data: Partial<ServiceTicket>): Promise<ServiceTicket> {
    return this.request<ServiceTicket>('/service-tickets/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServiceTicket(id: number, data: Partial<ServiceTicket>): Promise<ServiceTicket> {
    return this.request<ServiceTicket>(`/service-tickets/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Time Entries
  async getTimeEntries(userId?: number): Promise<ApiResponse<TimeEntry>> {
    const params = userId ? `?user=${userId}` : '';
    return this.request<ApiResponse<TimeEntry>>(`/time-entries/${params}`);
  }

  async createTimeEntry(data: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.request<TimeEntry>('/time-entries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTimeEntry(id: number, data: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.request<TimeEntry>(`/time-entries/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Scheduled Events
  async getScheduledEvents(): Promise<ApiResponse<ScheduledEvent>> {
    return this.request<ApiResponse<ScheduledEvent>>('/scheduled-events/');
  }

  async createScheduledEvent(data: Partial<ScheduledEvent>): Promise<ScheduledEvent> {
    return this.request<ScheduledEvent>('/scheduled-events/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateScheduledEvent(id: number, data: Partial<ScheduledEvent>): Promise<ScheduledEvent> {
    return this.request<ScheduledEvent>(`/scheduled-events/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Time Off Requests
  async getTimeOffRequests(userId?: number): Promise<ApiResponse<TimeOffRequest>> {
    const params = userId ? `?user=${userId}` : '';
    return this.request<ApiResponse<TimeOffRequest>>(`/time-off-requests/${params}`);
  }

  async createTimeOffRequest(data: Partial<TimeOffRequest>): Promise<TimeOffRequest> {
    return this.request<TimeOffRequest>('/time-off-requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTimeOffRequest(id: number, data: Partial<TimeOffRequest>): Promise<TimeOffRequest> {
    return this.request<TimeOffRequest>(`/time-off-requests/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Email functionality (if Django handles this)
  async sendEmail(data: {
    to: string[];
    subject: string;
    message: string;
    html?: string;
  }): Promise<void> {
    await this.request('/send-email/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const djangoApi = new DjangoApiService();
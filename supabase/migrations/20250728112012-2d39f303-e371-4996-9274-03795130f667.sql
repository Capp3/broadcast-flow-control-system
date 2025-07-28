-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT,
  department TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Inactive')),
  start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shifts table
CREATE TABLE public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create facilities table
CREATE TABLE public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location_id UUID REFERENCES public.locations(id),
  description TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Maintenance', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create incident types table
CREATE TABLE public.incident_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create incident tickets table
CREATE TABLE public.incident_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  incident_type_id UUID REFERENCES public.incident_types(id),
  reporter_id UUID REFERENCES public.profiles(user_id),
  assignee_id UUID REFERENCES public.profiles(user_id),
  facility_id UUID REFERENCES public.facilities(id),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Pending Review', 'Resolved', 'Closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create service tickets table
CREATE TABLE public.service_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  requested_by_id UUID REFERENCES public.profiles(user_id),
  assignee_id UUID REFERENCES public.profiles(user_id),
  service_type TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Pending Review', 'Completed', 'Cancelled')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create time entries table
CREATE TABLE public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  clock_in TIMESTAMP WITH TIME ZONE,
  clock_out TIMESTAMP WITH TIME ZONE,
  break_start TIMESTAMP WITH TIME ZONE,
  break_end TIMESTAMP WITH TIME ZONE,
  location_id UUID REFERENCES public.locations(id),
  shift_id UUID REFERENCES public.shifts(id),
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  approved_by_id UUID REFERENCES public.profiles(user_id),
  approved_at TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(5,2),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scheduled events table
CREATE TABLE public.scheduled_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location_id UUID REFERENCES public.locations(id),
  assigned_users UUID[] DEFAULT '{}',
  event_type TEXT,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  created_by_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create time off requests table
CREATE TABLE public.time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('Vacation', 'Sick Leave', 'Personal', 'Other')),
  reason TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  approved_by_id UUID REFERENCES public.profiles(user_id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_off_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables (allowing authenticated users to read/write)
-- Locations
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage locations" ON public.locations FOR ALL USING (auth.role() = 'authenticated');

-- Shifts
CREATE POLICY "Anyone can view shifts" ON public.shifts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage shifts" ON public.shifts FOR ALL USING (auth.role() = 'authenticated');

-- Facilities
CREATE POLICY "Anyone can view facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage facilities" ON public.facilities FOR ALL USING (auth.role() = 'authenticated');

-- Incident types
CREATE POLICY "Anyone can view incident types" ON public.incident_types FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage incident types" ON public.incident_types FOR ALL USING (auth.role() = 'authenticated');

-- Incident tickets
CREATE POLICY "Authenticated users can view incident tickets" ON public.incident_tickets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage incident tickets" ON public.incident_tickets FOR ALL USING (auth.role() = 'authenticated');

-- Service tickets
CREATE POLICY "Authenticated users can view service tickets" ON public.service_tickets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage service tickets" ON public.service_tickets FOR ALL USING (auth.role() = 'authenticated');

-- Time entries
CREATE POLICY "Users can view their own time entries" ON public.time_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own time entries" ON public.time_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Managers can view all time entries" ON public.time_entries FOR SELECT USING (auth.role() = 'authenticated');

-- Scheduled events
CREATE POLICY "Authenticated users can view scheduled events" ON public.scheduled_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage scheduled events" ON public.scheduled_events FOR ALL USING (auth.role() = 'authenticated');

-- Time off requests
CREATE POLICY "Users can view their own time off requests" ON public.time_off_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own time off requests" ON public.time_off_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Managers can view all time off requests" ON public.time_off_requests FOR SELECT USING (auth.role() = 'authenticated');

-- Create functions for timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incident_tickets_updated_at BEFORE UPDATE ON public.incident_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_tickets_updated_at BEFORE UPDATE ON public.service_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheduled_events_updated_at BEFORE UPDATE ON public.scheduled_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_off_requests_updated_at BEFORE UPDATE ON public.time_off_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial configuration data
INSERT INTO public.locations (name, description) VALUES
  ('Studio A', 'Main television studio'),
  ('Studio B', 'Secondary television studio'),
  ('Studio C', 'Backup/Flexible studio space'),
  ('Control Room', 'Master control room'),
  ('Edit Suite 1', 'Post-production editing suite'),
  ('Edit Suite 2', 'Secondary editing suite'),
  ('Reception', 'Main reception area'),
  ('Conference Room', 'Meeting and conference room');

INSERT INTO public.shifts (name, description, start_time, end_time) VALUES
  ('Morning Show', 'Early morning broadcast shift', '06:00', '12:00'),
  ('Afternoon News', 'Afternoon news production', '12:00', '18:00'),
  ('Evening News', 'Prime time news broadcast', '18:00', '22:00'),
  ('Late Night', 'Late night programming', '22:00', '06:00'),
  ('Weekend Special', 'Weekend programming shift', '08:00', '20:00'),
  ('Sports Coverage', 'Live sports event coverage', NULL, NULL),
  ('Documentary Production', 'Documentary filming and production', '09:00', '17:00'),
  ('Live Event Coverage', 'Special live event coverage', NULL, NULL);

INSERT INTO public.facilities (name, description, status) VALUES
  ('Main Studio', 'Primary television studio facility', 'Active'),
  ('Control Room A', 'Primary broadcast control room', 'Active'),
  ('Control Room B', 'Backup control room', 'Active'),
  ('Edit Suite 1', 'Professional video editing suite', 'Active'),
  ('Edit Suite 2', 'Secondary editing facility', 'Active'),
  ('Transmission Room', 'Signal transmission equipment room', 'Active'),
  ('Server Room', 'IT infrastructure and servers', 'Active'),
  ('Reception Area', 'Main building reception', 'Active'),
  ('Conference Room', 'Staff meeting and conference room', 'Active'),
  ('Archive Storage', 'Media archive and storage facility', 'Active');

INSERT INTO public.incident_types (name, description, severity_level) VALUES
  ('User Error', 'Mistakes made by end users', 2),
  ('Operator Error', 'Mistakes made by operators', 3),
  ('Equipment Failure', 'Hardware equipment malfunction', 4),
  ('Unknown', 'Issue with unknown root cause', 2),
  ('Ongoing Issue', 'Persistent or recurring problem', 3),
  ('System Outage', 'Complete system failure', 5),
  ('Network Issue', 'Network connectivity problems', 3),
  ('Software Bug', 'Software-related malfunction', 2),
  ('Hardware Malfunction', 'Physical hardware failure', 4),
  ('Power Issue', 'Electrical power problems', 4);
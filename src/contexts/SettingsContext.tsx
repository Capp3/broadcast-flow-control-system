import React, { createContext, useContext, useState, useEffect } from 'react';
import { djangoApi } from '@/services/django-api';
import { Location, Shift, Facility, IncidentType, ScheduledEvent } from '@/types/django';

interface SettingsContextType {
  locations: Location[];
  shifts: Shift[];
  facilities: Facility[];
  incidentTypes: IncidentType[];
  getScheduledEvents: (date: string) => Promise<ScheduledEvent[]>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [locationsRes, shiftsRes, facilitiesRes, incidentTypesRes] = await Promise.all([
        djangoApi.getLocations(),
        djangoApi.getShifts(),
        djangoApi.getFacilities(),
        djangoApi.getIncidentTypes(),
      ]);

      setLocations(locationsRes.results || []);
      setShifts(shiftsRes.results || []);
      setFacilities(facilitiesRes.results || []);
      setIncidentTypes(incidentTypesRes.results || []);
    } catch (error) {
      console.error('Failed to load settings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScheduledEvents = async (date: string): Promise<ScheduledEvent[]> => {
    try {
      const response = await djangoApi.getScheduledEvents();
      const events = response.results || [];
      
      // Filter events for the specific date
      return events.filter(event => {
        const eventDate = new Date(event.start_time).toISOString().split('T')[0];
        return eventDate === date;
      });
    } catch (error) {
      console.error('Failed to load scheduled events:', error);
      return [];
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value = {
    locations,
    shifts,
    facilities,
    incidentTypes,
    getScheduledEvents,
    refreshData,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

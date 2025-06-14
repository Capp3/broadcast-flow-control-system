
import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  locations: string[];
  shifts: string[];
  getScheduledEvents: (date: string) => Array<{id: string, name: string, time: string}>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock data - in real app this would come from management/settings panel
  const [locations] = useState([
    'Studio A',
    'Studio B',
    'Studio C',
    'Control Room',
    'Edit Suite 1',
    'Edit Suite 2',
    'Reception',
    'Conference Room'
  ]);

  const [shifts] = useState([
    'Morning Show',
    'Afternoon News',
    'Evening News',
    'Late Night',
    'Weekend Special',
    'Sports Coverage',
    'Documentary Production',
    'Live Event Coverage'
  ]);

  // Mock scheduled events lookup
  const getScheduledEvents = (date: string) => {
    // Mock events for demonstration
    const mockEvents = [
      { id: '1', name: 'Morning Briefing', time: '08:00' },
      { id: '2', name: 'News at Six', time: '18:00' },
      { id: '3', name: 'Sports Update', time: '20:30' }
    ];
    
    // In real app, this would query actual scheduled events for the date
    return mockEvents;
  };

  const value = {
    locations,
    shifts,
    getScheduledEvents
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

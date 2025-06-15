
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';

const Schedule = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Hours for the schedule (6 AM to 12 AM)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };
  
  // Mock data for scheduled events and user shifts
  const getEventsForDateTime = (date: Date, hour: number) => {
    const events = [];
    
    // Mock scheduled events
    if (isSameDay(date, weekDays[0]) && hour === 8) {
      events.push({ type: 'event', title: 'Morning Show', duration: 3, staffed: true });
    }
    if (isSameDay(date, weekDays[0]) && hour === 18) {
      events.push({ type: 'event', title: 'Evening News', duration: 1, staffed: false });
    }
    if (isSameDay(date, weekDays[1]) && hour === 9) {
      events.push({ type: 'event', title: 'Talk Show', duration: 2, staffed: true });
    }
    if (isSameDay(date, weekDays[3]) && hour === 14) {
      events.push({ type: 'event', title: 'Sports Update', duration: 1, staffed: true });
    }
    if (isSameDay(date, weekDays[4]) && hour === 19) {
      events.push({ type: 'event', title: 'Weekend Prep', duration: 2, staffed: false });
    }
    
    // Mock user shifts for logged in user
    if (isSameDay(date, weekDays[0]) && hour === 7) {
      events.push({ type: 'shift', title: 'Your Shift - Studio A', duration: 8, staffed: true });
    }
    if (isSameDay(date, weekDays[2]) && hour === 13) {
      events.push({ type: 'shift', title: 'Your Shift - Control Room', duration: 6, staffed: true });
    }
    if (isSameDay(date, weekDays[4]) && hour === 16) {
      events.push({ type: 'shift', title: 'Your Shift - Edit Suite', duration: 4, staffed: true });
    }
    
    return events;
  };
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule - Week of {format(weekStart, 'MMMM d, yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="h-4 w-4" />
                Previous Week
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                Next Week
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 bg-gray-50 border-b">
                <div className="p-4 border-r font-medium text-gray-600">Time</div>
                {weekDays.map((day, index) => (
                  <div key={index} className="p-4 border-r font-medium text-center">
                    <div className="text-sm text-gray-600">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b hover:bg-gray-50">
                  {/* Time Column */}
                  <div className="p-3 border-r bg-gray-50 font-medium text-sm text-gray-600">
                    {formatHour(hour)}
                  </div>
                  
                  {/* Day Columns */}
                  {weekDays.map((day, dayIndex) => {
                    const events = getEventsForDateTime(day, hour);
                    return (
                      <div key={dayIndex} className="border-r min-h-[60px] p-2 relative">
                        {events.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className={`text-xs p-2 rounded mb-1 ${
                              event.type === 'shift'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : event.staffed
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                            style={{
                              height: `${Math.min(event.duration * 20, 120)}px`,
                              overflow: 'hidden'
                            }}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {event.type === 'shift' ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              <span className="font-medium">{event.title}</span>
                            </div>
                            <div className="text-xs opacity-75">
                              {event.duration}h duration
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-sm text-gray-700">Your Shifts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-sm text-gray-700">Staffed Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded"></div>
              <span className="text-sm text-gray-700">Unstaffed Events</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;

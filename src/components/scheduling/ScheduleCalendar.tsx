
import React, { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MapPin, Repeat, Edit } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  type: 'event' | 'shift';
  isRecurring: boolean;
  shifts?: Shift[];
  color: string;
}

interface Shift {
  id: string;
  eventId?: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  assignedStaff?: string[];
  isRecurring: boolean;
  color: string;
}

interface ScheduleCalendarProps {
  currentWeek: Date;
  mode: 'schedule' | 'rota';
  onEventEdit: (event: Event) => void;
  onShiftEdit: (shift: Shift) => void;
}

const ScheduleCalendar = ({ currentWeek, mode, onEventEdit, onShiftEdit }: ScheduleCalendarProps) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 12 AM

  // Mock data - in real app this would come from state management
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Morning Show',
      startTime: '08:00',
      endTime: '11:00',
      facility: 'Studio A',
      type: 'event',
      isRecurring: true,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      shifts: [
        {
          id: 's1',
          eventId: '1',
          title: 'Show Host',
          startTime: '07:30',
          endTime: '11:30',
          facility: 'Studio A',
          assignedStaff: ['John Doe'],
          isRecurring: true,
          color: 'bg-green-100 text-green-800 border-green-200'
        }
      ]
    },
    {
      id: '2',
      title: 'Evening News',
      startTime: '18:00',
      endTime: '19:00',
      facility: 'Studio B',
      type: 'event',
      isRecurring: true,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      shifts: [
        {
          id: 's2',
          eventId: '2',
          title: 'News Anchor',
          startTime: '17:30',
          endTime: '19:30',
          facility: 'Studio B',
          assignedStaff: ['Jane Smith'],
          isRecurring: true,
          color: 'bg-orange-100 text-orange-800 border-orange-200'
        }
      ]
    }
  ]);

  const [standaloneShifts] = useState<Shift[]>([
    {
      id: 's3',
      title: 'Technical Support',
      startTime: '09:00',
      endTime: '17:00',
      facility: 'Control Room',
      assignedStaff: ['Mike Johnson'],
      isRecurring: false,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  ]);

  const getItemsForDateTime = (date: Date, hour: number) => {
    const items = [];
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;

    // Add events
    events.forEach(event => {
      if (shouldShowOnDate(date, event.isRecurring) && isTimeInRange(timeStr, event.startTime, event.endTime)) {
        items.push({ ...event, itemType: 'event' });
        
        // Add event shifts if in schedule mode
        if (mode === 'schedule' && event.shifts) {
          event.shifts.forEach(shift => {
            if (isTimeInRange(timeStr, shift.startTime, shift.endTime)) {
              items.push({ ...shift, itemType: 'shift' });
            }
          });
        }
      }
    });

    // Add standalone shifts
    standaloneShifts.forEach(shift => {
      if (shouldShowOnDate(date, shift.isRecurring) && isTimeInRange(timeStr, shift.startTime, shift.endTime)) {
        items.push({ ...shift, itemType: 'shift' });
      }
    });

    return items;
  };

  const shouldShowOnDate = (date: Date, isRecurring: boolean) => {
    // For demo, show recurring items on weekdays, non-recurring on specific days
    if (isRecurring) {
      return date.getDay() >= 1 && date.getDay() <= 5; // Monday to Friday
    }
    return isSameDay(date, weekDays[2]); // Wednesday for demo
  };

  const isTimeInRange = (timeStr: string, startTime: string, endTime: string) => {
    return timeStr >= startTime && timeStr < endTime;
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const handleItemClick = (item: any) => {
    if (item.itemType === 'event') {
      onEventEdit(item);
    } else {
      onShiftEdit(item);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 bg-gray-50 border-b">
              <div className="p-4 border-r font-medium text-gray-600">Time</div>
              {weekDays.map((day, index) => (
                <div key={index} className="p-4 border-r font-medium text-center">
                  <div className="text-sm text-gray-600">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-lg font-semibold">
                    {format(day, 'd MMM')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b hover:bg-gray-50 min-h-[80px]">
                {/* Time Column */}
                <div className="p-3 border-r bg-gray-50 font-medium text-sm text-gray-600">
                  {formatHour(hour)}
                </div>
                
                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => {
                  const items = getItemsForDateTime(day, hour);
                  return (
                    <div key={dayIndex} className="border-r p-2 relative min-h-[80px]">
                      {items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`text-xs p-2 rounded mb-1 border cursor-pointer hover:opacity-80 ${item.color}`}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {item.itemType === 'event' ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <User className="h-3 w-3" />
                            )}
                            <span className="font-medium truncate">{item.title}</span>
                            {item.isRecurring && <Repeat className="h-2 w-2 ml-auto" />}
                          </div>
                          <div className="flex items-center gap-1 text-xs opacity-75">
                            <MapPin className="h-2 w-2" />
                            <span className="truncate">{item.facility}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {item.startTime} - {item.endTime}
                          </div>
                          {mode === 'rota' && item.assignedStaff && (
                            <div className="text-xs opacity-75 mt-1">
                              Staff: {item.assignedStaff.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Events</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Shifts</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span>Recurring</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Click items to edit</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;

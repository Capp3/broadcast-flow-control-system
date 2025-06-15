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
  const HOUR_HEIGHT = 80; // Height of each hour slot in pixels

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

  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const calculateItemPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const startHour = Math.floor(startMinutes / 60);
    const endHour = Math.floor(endMinutes / 60);
    
    // Calculate position from 6 AM
    const topOffset = ((startMinutes - 6 * 60) / 60) * HOUR_HEIGHT;
    const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;
    
    return {
      top: topOffset,
      height: height,
      startHour,
      endHour,
      startMinutes
    };
  };

  const detectOverlaps = (items: any[]) => {
    // Sort items by start time first
    const sortedItems = [...items].sort((a, b) => a.position.startMinutes - b.position.startMinutes);
    
    // Assign layers based on overlaps
    const layeredItems = sortedItems.map((item, index) => {
      let layer = 0;
      
      // Check for overlaps with previous items
      for (let i = 0; i < index; i++) {
        const prevItem = sortedItems[i];
        const itemStart = item.position.startMinutes;
        const itemEnd = item.position.startMinutes + (item.position.height / HOUR_HEIGHT) * 60;
        const prevStart = prevItem.position.startMinutes;
        const prevEnd = prevItem.position.startMinutes + (prevItem.position.height / HOUR_HEIGHT) * 60;
        
        // Check if items overlap
        if (itemStart < prevEnd && itemEnd > prevStart) {
          layer = Math.max(layer, (prevItem.calculatedLayer || 0) + 1);
        }
      }
      
      return {
        ...item,
        calculatedLayer: layer
      };
    });

    return layeredItems;
  };

  const getItemsForDay = (date: Date) => {
    const items = [];

    // Add events
    events.forEach(event => {
      if (shouldShowOnDate(date, event.isRecurring)) {
        const position = calculateItemPosition(event.startTime, event.endTime);
        items.push({ 
          ...event, 
          itemType: 'event', 
          position,
          originalLayerIndex: 0
        });
        
        // Add event shifts if in schedule mode
        if (mode === 'schedule' && event.shifts) {
          event.shifts.forEach((shift, index) => {
            const shiftPosition = calculateItemPosition(shift.startTime, shift.endTime);
            items.push({ 
              ...shift, 
              itemType: 'shift', 
              position: shiftPosition,
              originalLayerIndex: index + 1
            });
          });
        }
      }
    });

    // Add standalone shifts
    standaloneShifts.forEach(shift => {
      if (shouldShowOnDate(date, shift.isRecurring)) {
        const position = calculateItemPosition(shift.startTime, shift.endTime);
        items.push({ 
          ...shift, 
          itemType: 'shift', 
          position,
          originalLayerIndex: 0
        });
      }
    });

    // Detect overlaps and assign proper layers
    return detectOverlaps(items);
  };

  const shouldShowOnDate = (date: Date, isRecurring: boolean) => {
    // For demo, show recurring items on weekdays, non-recurring on specific days
    if (isRecurring) {
      return date.getDay() >= 1 && date.getDay() <= 5; // Monday to Friday
    }
    return isSameDay(date, weekDays[2]); // Wednesday for demo
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

            {/* Calendar Grid Container */}
            <div className="relative">
              {/* Time Slots Background */}
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b hover:bg-gray-50" style={{ height: `${HOUR_HEIGHT}px` }}>
                  {/* Time Column */}
                  <div className="p-3 border-r bg-gray-50 font-medium text-sm text-gray-600 flex items-start">
                    {formatHour(hour)}
                  </div>
                  
                  {/* Day Columns */}
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-r relative" style={{ height: `${HOUR_HEIGHT}px` }}>
                      {/* Empty slot for background */}
                    </div>
                  ))}
                </div>
              ))}

              {/* Floating Items */}
              {weekDays.map((day, dayIndex) => {
                const dayItems = getItemsForDay(day);
                return dayItems.map((item, itemIndex) => {
                  const layer = item.calculatedLayer || 0;
                  const maxLayers = Math.max(...dayItems.map(i => i.calculatedLayer || 0)) + 1;
                  const widthReduction = Math.min(layer * 8, 40); // Max 40% width reduction
                  const leftOffset = layer * 4; // 4% left offset per layer
                  
                  return (
                    <div
                      key={`${dayIndex}-${itemIndex}`}
                      className={`absolute text-xs p-2 rounded border cursor-pointer hover:opacity-80 transition-all ${item.color} shadow-sm`}
                      style={{
                        top: `${item.position.top}px`,
                        height: `${item.position.height}px`,
                        left: `${(100 / 8) * (dayIndex + 1) + leftOffset}%`,
                        width: `${(100 / 8) - widthReduction/8 - 0.5}%`,
                        zIndex: 10 + layer, // Higher z-index for later items
                        minHeight: '40px'
                      }}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {item.itemType === 'event' ? (
                          <Clock className="h-3 w-3 flex-shrink-0" />
                        ) : (
                          <User className="h-3 w-3 flex-shrink-0" />
                        )}
                        <span className="font-medium truncate">{item.title}</span>
                        {item.isRecurring && <Repeat className="h-2 w-2 ml-auto flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
                        <MapPin className="h-2 w-2 flex-shrink-0" />
                        <span className="truncate">{item.facility}</span>
                      </div>
                      <div className="text-xs opacity-75 mb-1">
                        {item.startTime} - {item.endTime}
                      </div>
                      {mode === 'rota' && item.assignedStaff && (
                        <div className="text-xs opacity-75">
                          Staff: {item.assignedStaff.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                });
              })}
            </div>
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

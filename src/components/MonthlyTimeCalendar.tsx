
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

interface TimeEntry {
  id: number;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
  hours: number;
}

interface HolidayRequest {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
}

interface MonthlyTimeCalendarProps {
  timeEntries: TimeEntry[];
  holidayRequests: HolidayRequest[];
}

const MonthlyTimeCalendar = ({ timeEntries, holidayRequests }: MonthlyTimeCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const events = [];

    // Check for time entries
    const timeEntry = timeEntries.find(entry => entry.date === dateStr);
    if (timeEntry) {
      events.push({
        type: 'time',
        data: timeEntry
      });
    }

    // Check for holiday requests
    const holidayRequest = holidayRequests.find(request => {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      return date >= startDate && date <= endDate;
    });
    if (holidayRequest) {
      events.push({
        type: 'holiday',
        data: holidayRequest
      });
    }

    return events;
  };

  const renderDayContent = (date: Date) => {
    const events = getEventsForDate(date);
    
    return (
      <div className="w-full h-full min-h-[80px] p-1">
        <div className="text-sm font-medium mb-1">{format(date, 'd')}</div>
        <div className="space-y-1">
          {events.map((event, index) => (
            <div key={index} className="text-xs">
              {event.type === 'time' && (
                <div className={`px-1 py-0.5 rounded text-white ${
                  event.data.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  <div className="flex items-center gap-1">
                    <Clock className="h-2 w-2" />
                    <span>{event.data.timeIn}-{event.data.timeOut}</span>
                  </div>
                  <div>{event.data.hours}h</div>
                </div>
              )}
              {event.type === 'holiday' && (
                <div className={`px-1 py-0.5 rounded text-white ${
                  event.data.status === 'approved' ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-2 w-2" />
                    <span>{event.data.type.substring(0, 3)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Monthly Overview - {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }, (_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - 6);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={i}
                className={`border rounded-lg ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-50'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                {renderDayContent(date)}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Approved Time</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Pending Time</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Approved Leave</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Pending Leave</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTimeCalendar;

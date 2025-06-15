import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Calendar, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import EnhancedClockEntryForm from '@/components/EnhancedClockEntryForm';
import TimeOffRequestForm from '@/components/TimeOffRequestForm';
import { useToast } from '@/hooks/use-toast';
import { SettingsProvider } from '@/contexts/SettingsContext';

const TimeKeeping = () => {
  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      date: '2025-06-14',
      timeIn: '08:00',
      timeOut: '16:00',
      location: 'Studio A',
      shift: 'Morning Show',
      status: 'approved',
      hours: 8,
      lunchTaken: 0.5
    },
    {
      id: 2,
      date: '2025-06-13',
      timeIn: '14:00',
      timeOut: '22:00',
      location: 'Studio B',
      shift: 'Evening News',
      status: 'pending',
      hours: 8,
      lunchTaken: 0.5
    },
  ]);

  const [holidayRequests, setHolidayRequests] = useState([
    {
      id: 1,
      startDate: '2025-06-25',
      endDate: '2025-06-27',
      hours: 24,
      status: 'pending',
      type: 'Personal Time Off'
    },
    {
      id: 2,
      startDate: '2025-07-01',
      endDate: '2025-07-01',
      hours: 8,
      status: 'approved',
      type: 'Personal Day'
    },
  ]);

  const [isClockEntryOpen, setIsClockEntryOpen] = useState(false);
  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false);
  const { toast } = useToast();

  // Holiday calculations
  const totalHolidayHours = 168; // 22 days * 7.5 hours
  const usedHolidayHours = holidayRequests
    .filter(req => req.status === 'approved' && req.type !== 'Sick Leave')
    .reduce((total, req) => total + req.hours, 0);
  const pendingHolidayHours = holidayRequests
    .filter(req => req.status === 'pending' && req.type !== 'Sick Leave')
    .reduce((total, req) => total + req.hours, 0);
  const availableHolidayHours = totalHolidayHours - usedHolidayHours - pendingHolidayHours;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleClockEntrySubmit = (data: any) => {
    const newEntry = {
      id: timeEntries.length + 1,
      date: data.date,
      timeIn: data.timeIn,
      timeOut: data.timeOut || '--:--',
      location: data.location,
      shift: data.shift || 'General',
      status: 'pending',
      hours: data.hours,
      lunchTaken: data.lunchTaken
    };

    setTimeEntries([newEntry, ...timeEntries]);
    setIsClockEntryOpen(false);
    
    toast({
      title: "Clock Entry Created",
      description: "Your time entry has been submitted for approval.",
    });
  };

  const handleTimeOffSubmit = (data: any) => {
    const newRequest = {
      id: holidayRequests.length + 1,
      startDate: data.startDate,
      endDate: data.endDate,
      hours: data.hours,
      status: 'pending',
      type: data.type
    };

    setHolidayRequests([newRequest, ...holidayRequests]);
    setIsTimeOffOpen(false);
    
    toast({
      title: "Time Off Request Submitted",
      description: `Your ${data.type.toLowerCase()} request has been submitted for approval.`,
    });
  };

  return (
    <SettingsProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Time Keeping</h1>
          <div className="flex gap-3">
            <Dialog open={isClockEntryOpen} onOpenChange={setIsClockEntryOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Clock Entry
                </Button>
              </DialogTrigger>
              <EnhancedClockEntryForm 
                onSubmit={handleClockEntrySubmit}
                onCancel={() => setIsClockEntryOpen(false)}
                existingEntries={timeEntries}
              />
            </Dialog>
            <Dialog open={isTimeOffOpen} onOpenChange={setIsTimeOffOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Time Off Request
                </Button>
              </DialogTrigger>
              <TimeOffRequestForm 
                onSubmit={handleTimeOffSubmit}
                onCancel={() => setIsTimeOffOpen(false)}
              />
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Holiday</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableHolidayHours} hrs</div>
              <p className="text-xs text-gray-600">
                {usedHolidayHours} hrs used • {pendingHolidayHours} hrs pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">TOIL Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 hrs</div>
              <p className="text-xs text-gray-600">Time off in lieu</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32 hrs</div>
              <p className="text-xs text-gray-600">Hours worked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overtime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4 hrs</div>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Time Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Time Entries
            </CardTitle>
            <CardDescription>Your recent clock in/out records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(entry.status)}
                    <div>
                      <div className="font-medium">{entry.date}</div>
                      <div className="text-sm text-gray-600">
                        {entry.timeIn} - {entry.timeOut} • {entry.location}
                      </div>
                      <div className="text-sm text-blue-600">{entry.shift}</div>
                      {entry.lunchTaken && (
                        <div className="text-xs text-gray-500">
                          Lunch: {entry.lunchTaken}h
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{entry.hours} hrs</div>
                    <div className="text-sm text-gray-600 capitalize">{entry.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holiday Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Time Off Requests
            </CardTitle>
            <CardDescription>Your time off requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {holidayRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <div className="font-medium">{request.type}</div>
                      <div className="text-sm text-gray-600">
                        {request.startDate} - {request.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{request.hours} hrs</div>
                    <div className="text-sm text-gray-600 capitalize">{request.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsProvider>
  );
};

export default TimeKeeping;

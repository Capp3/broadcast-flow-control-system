import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Calendar, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ClockEntryForm from '@/components/ClockEntryForm';
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
      hours: 8
    },
    {
      id: 2,
      date: '2025-06-13',
      timeIn: '14:00',
      timeOut: '22:00',
      location: 'Studio B',
      shift: 'Evening News',
      status: 'pending',
      hours: 8
    },
  ]);

  const [holidayRequests] = useState([
    {
      id: 1,
      startDate: '2025-06-25',
      endDate: '2025-06-27',
      hours: 24,
      status: 'pending',
      type: 'Annual Leave'
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
  const { toast } = useToast();

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
    // Calculate hours if both timeIn and timeOut are provided
    let hours = 0;
    if (data.timeIn && data.timeOut) {
      const [inHour, inMin] = data.timeIn.split(':').map(Number);
      const [outHour, outMin] = data.timeOut.split(':').map(Number);
      const timeInMinutes = inHour * 60 + inMin;
      const timeOutMinutes = outHour * 60 + outMin;
      hours = Math.round((timeOutMinutes - timeInMinutes) / 60 * 10) / 10;
    }

    const newEntry = {
      id: timeEntries.length + 1,
      date: data.date,
      timeIn: data.timeIn,
      timeOut: data.timeOut || '--:--',
      location: data.location,
      shift: data.shift || 'General',
      status: 'pending',
      hours: hours
    };

    setTimeEntries([newEntry, ...timeEntries]);
    setIsClockEntryOpen(false);
    
    toast({
      title: "Clock Entry Created",
      description: "Your time entry has been submitted for approval.",
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
              <ClockEntryForm 
                onSubmit={handleClockEntrySubmit}
                onCancel={() => setIsClockEntryOpen(false)}
                existingEntries={timeEntries}
              />
            </Dialog>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Time Off Request
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Holiday</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156 hrs</div>
              <p className="text-xs text-gray-600">Remaining this year</p>
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
              Holiday Requests
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

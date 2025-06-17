
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for time clock entries pending approval
const mockTimeEntries = [
  {
    id: 'TC-001',
    employeeName: 'John Operator',
    employeeId: 'EMP-001',
    date: '2024-06-14',
    clockIn: '08:00:00',
    clockOut: '16:00:00',
    totalHours: 8.0,
    department: 'Operations',
    status: 'pending',
    notes: 'Regular shift',
    overtime: false
  },
  {
    id: 'TC-002',
    employeeName: 'Sarah Tech',
    employeeId: 'EMP-002',
    date: '2024-06-14',
    clockIn: '07:30:00',
    clockOut: '17:30:00',
    totalHours: 10.0,
    department: 'Engineering',
    status: 'pending',
    notes: 'Extended shift for maintenance',
    overtime: true
  },
  {
    id: 'TC-003',
    employeeName: 'Mike Engineer',
    employeeId: 'EMP-003',
    date: '2024-06-13',
    clockIn: '22:00:00',
    clockOut: '06:00:00',
    totalHours: 8.0,
    department: 'Engineering',
    status: 'flagged',
    notes: 'Night shift - emergency repair',
    overtime: false
  },
  {
    id: 'TC-004',
    employeeName: 'Lisa Operator',
    employeeId: 'EMP-004',
    date: '2024-06-14',
    clockIn: '12:00:00',
    clockOut: '20:00:00',
    totalHours: 8.0,
    department: 'Operations',
    status: 'approved',
    notes: 'Afternoon shift',
    overtime: false
  }
];

const TimeClockApproval = () => {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const { toast } = useToast();

  const filteredEntries = timeEntries.filter(entry => 
    statusFilter === 'all' ? true : entry.status === statusFilter
  );

  const handleApprove = (entryId: string) => {
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, status: 'approved' } : entry
      )
    );
    toast({
      title: "Entry Approved",
      description: `Time entry ${entryId} has been approved.`,
    });
  };

  const handleReject = (entryId: string) => {
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, status: 'rejected' } : entry
      )
    );
    toast({
      title: "Entry Rejected",
      description: `Time entry ${entryId} has been rejected.`,
      variant: "destructive"
    });
  };

  const handleFlag = (entryId: string) => {
    setTimeEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, status: 'flagged' } : entry
      )
    );
    toast({
      title: "Entry Flagged",
      description: `Time entry ${entryId} has been flagged for review.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Time Clock Approval
          </h2>
          <p className="text-muted-foreground">
            Review and approve employee time entries
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="all">All Entries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Entries ({filteredEntries.length})</CardTitle>
          <CardDescription>
            Review employee time clock punches and approve for payroll processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{entry.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{entry.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(entry.date)}
                      </div>
                    </TableCell>
                    <TableCell>{formatTime(entry.clockIn)}</TableCell>
                    <TableCell>{formatTime(entry.clockOut)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.totalHours}h
                        {entry.overtime && (
                          <Badge variant="outline" className="text-xs">OT</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{entry.department}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {entry.notes}
                    </TableCell>
                    <TableCell>
                      {entry.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(entry.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFlag(entry.id)}
                          >
                            <AlertTriangle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(entry.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {entry.status === 'flagged' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(entry.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(entry.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredEntries.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No {statusFilter} time entries found.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeClockApproval;

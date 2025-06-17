
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User,
  Calendar
} from 'lucide-react';

// Mock data for time entries pending approval
const pendingTimeEntries = [
  {
    id: 1,
    employeeName: 'John Operator',
    date: '2024-01-15',
    clockIn: '07:45',
    clockOut: '16:30',
    totalHours: 8.75,
    overtime: 0.75,
    notes: 'Stayed late to complete system maintenance',
    status: 'pending'
  },
  {
    id: 2,
    employeeName: 'Sarah Engineer',
    date: '2024-01-15',
    clockIn: '08:00',
    clockOut: '17:45',
    totalHours: 9.75,
    overtime: 1.75,
    notes: 'Emergency repair on transmitter 2',
    status: 'pending'
  },
  {
    id: 3,
    employeeName: 'Mike Manager',
    date: '2024-01-14',
    clockIn: '06:30',
    clockOut: '15:00',
    totalHours: 8.5,
    overtime: 0,
    notes: 'Early start for client meeting',
    status: 'flagged'
  },
  {
    id: 4,
    employeeName: 'Lisa Technician',
    date: '2024-01-14',
    clockIn: '09:15',
    clockOut: '18:00',
    totalHours: 8.75,
    overtime: 0.75,
    notes: 'Late start due to traffic',
    status: 'pending'
  }
];

const TimeClockApproval = () => {
  const [entries, setEntries] = useState(pendingTimeEntries);
  const [filter, setFilter] = useState('all');

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'overtime') return entry.overtime > 0;
    if (filter === 'flagged') return entry.status === 'flagged';
    return entry.status === filter;
  });

  const handleApprove = (id: number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: 'approved' } : entry
    ));
  };

  const handleReject = (id: number) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: 'rejected' } : entry
    ));
  };

  const handleBulkApprove = () => {
    const pendingIds = filteredEntries
      .filter(entry => entry.status === 'pending')
      .map(entry => entry.id);
    
    setEntries(entries.map(entry => 
      pendingIds.includes(entry.id) ? { ...entry, status: 'approved' } : entry
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const pendingCount = entries.filter(e => e.status === 'pending').length;
  const flaggedCount = entries.filter(e => e.status === 'flagged').length;
  const overtimeCount = entries.filter(e => e.overtime > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Time Clock Approval
          </h2>
          <p className="text-muted-foreground">Review and approve employee time entries</p>
        </div>
        {pendingCount > 0 && (
          <Button onClick={handleBulkApprove}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve All Pending ({pendingCount})
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged Entries</p>
                <p className="text-2xl font-bold">{flaggedCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overtime Entries</p>
                <p className="text-2xl font-bold">{overtimeCount}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Entries
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'flagged' ? 'default' : 'outline'}
          onClick={() => setFilter('flagged')}
        >
          Flagged ({flaggedCount})
        </Button>
        <Button
          variant={filter === 'overtime' ? 'default' : 'outline'}
          onClick={() => setFilter('overtime')}
        >
          Overtime ({overtimeCount})
        </Button>
      </div>

      {/* Time Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.employeeName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </div>
                  </TableCell>
                  <TableCell>{entry.clockIn}</TableCell>
                  <TableCell>{entry.clockOut}</TableCell>
                  <TableCell>{entry.totalHours}h</TableCell>
                  <TableCell>
                    {entry.overtime > 0 ? (
                      <span className="text-orange-600 font-medium">{entry.overtime}h</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={entry.notes}>
                    {entry.notes}
                  </TableCell>
                  <TableCell>
                    {entry.status === 'pending' || entry.status === 'flagged' ? (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(entry.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(entry.id)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {entry.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeClockApproval;

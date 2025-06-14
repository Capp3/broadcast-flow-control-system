
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calendar, Clock, User } from 'lucide-react';

// Mock data for incident tickets
const mockIncidentTickets = [
  {
    id: 'INC-001',
    title: 'Transmitter Power Failure - Studio A',
    description: 'Main transmitter lost power during morning broadcast',
    status: 'open',
    priority: 'high',
    assignedTo: 'John Engineer',
    reportedBy: 'Mike Operator',
    createdAt: '2024-06-14T08:30:00Z',
    updatedAt: '2024-06-14T09:15:00Z',
    category: 'Equipment Failure'
  },
  {
    id: 'INC-002',
    title: 'Audio Distortion on FM Channel',
    description: 'Listeners reporting audio quality issues on 101.5 FM',
    status: 'open',
    priority: 'medium',
    assignedTo: 'Sarah Tech',
    reportedBy: 'Lisa Operator',
    createdAt: '2024-06-14T10:00:00Z',
    updatedAt: '2024-06-14T10:30:00Z',
    category: 'Signal Quality'
  },
  {
    id: 'INC-003',
    title: 'Backup Generator Test Failed',
    description: 'Weekly generator test showed fuel system issues',
    status: 'closed',
    priority: 'low',
    assignedTo: 'Tom Maintenance',
    reportedBy: 'System Automated',
    createdAt: '2024-06-13T14:00:00Z',
    updatedAt: '2024-06-13T16:30:00Z',
    category: 'Maintenance'
  },
  {
    id: 'INC-004',
    title: 'Network Connectivity Issues',
    description: 'Intermittent internet connection affecting streaming services',
    status: 'open',
    priority: 'high',
    assignedTo: 'Alex Network',
    reportedBy: 'Dave Operator',
    createdAt: '2024-06-14T11:45:00Z',
    updatedAt: '2024-06-14T12:00:00Z',
    category: 'Network'
  },
  {
    id: 'INC-005',
    title: 'Studio Lighting Malfunction',
    description: 'Emergency lighting system not functioning properly',
    status: 'closed',
    priority: 'medium',
    assignedTo: 'Bob Electrician',
    reportedBy: 'Jane Host',
    createdAt: '2024-06-12T16:20:00Z',
    updatedAt: '2024-06-13T08:00:00Z',
    category: 'Facilities'
  }
];

const IncidentTickets = () => {
  const [statusFilter, setStatusFilter] = useState('open');

  const filteredTickets = mockIncidentTickets.filter(ticket => 
    statusFilter === 'all' ? true : ticket.status === statusFilter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-8 w-8" />
          Incident Tickets
        </h1>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open Tickets</SelectItem>
              <SelectItem value="closed">Closed Tickets</SelectItem>
              <SelectItem value="all">All Tickets</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <AlertTriangle className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Manage and track incident reports and resolutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {ticket.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {ticket.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        {formatDate(ticket.updatedAt)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No {statusFilter} tickets found.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentTickets;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertTriangle, Calendar, Clock, User, X, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for tickets awaiting review
const mockTicketsForReview = [
  {
    id: 'TKT-001',
    type: 'incident',
    title: 'Transmitter Power Failure - Studio A',
    description: 'Main transmitter lost power during morning broadcast',
    status: 'pending_review',
    priority: 'high',
    reportedBy: 'Mike Operator',
    createdAt: '2024-06-14T08:30:00Z',
    category: 'Equipment Failure',
    followUpNeeded: true,
    timeDown: '45 minutes'
  },
  {
    id: 'TKT-002',
    type: 'incident',
    title: 'User Error - Wrong Playlist',
    description: 'Operator accidentally loaded wrong playlist for morning show',
    status: 'pending_review',
    priority: 'low',
    reportedBy: 'Lisa Operator',
    createdAt: '2024-06-14T09:15:00Z',
    category: 'User Error',
    followUpNeeded: false,
    timeDown: '5 minutes'
  },
  {
    id: 'TKT-003',
    type: 'change_request',
    title: 'Update Studio Lighting Schedule',
    description: 'Request to modify automated lighting schedule for evening shows',
    status: 'pending_review',
    priority: 'medium',
    reportedBy: 'Jane Host',
    createdAt: '2024-06-14T10:00:00Z',
    category: 'Facilities',
    followUpNeeded: true,
    timeDown: null
  },
  {
    id: 'TKT-004',
    type: 'incident',
    title: 'Audio Distortion on FM Channel',
    description: 'Listeners reporting audio quality issues on 101.5 FM',
    status: 'pending_review',
    priority: 'high',
    reportedBy: 'Dave Operator',
    createdAt: '2024-06-14T11:30:00Z',
    category: 'Signal Quality',
    followUpNeeded: true,
    timeDown: 'Ongoing'
  },
  {
    id: 'TKT-005',
    type: 'incident',
    title: 'Operator Error - Missed Cue',
    description: 'Operator missed commercial break cue during live broadcast',
    status: 'pending_review',
    priority: 'low',
    reportedBy: 'Tom Operator',
    createdAt: '2024-06-14T12:45:00Z',
    category: 'Operator Error',
    followUpNeeded: false,
    timeDown: '2 minutes'
  }
];

const TicketReview = () => {
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [tickets, setTickets] = useState(mockTicketsForReview);
  const { toast } = useToast();

  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' ? true : ticket.status === statusFilter
  );

  const handleCloseTicket = (ticketId: string, title: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'closed' }
          : ticket
      )
    );
    
    toast({
      title: "Ticket Closed",
      description: `Ticket ${ticketId} has been closed and requires no further action.`,
    });
  };

  const handleApproveForEngineering = (ticketId: string, title: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'approved_for_engineering' }
          : ticket
      )
    );
    
    toast({
      title: "Ticket Approved",
      description: `Ticket ${ticketId} has been approved and sent to engineering for evaluation.`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'incident': return 'bg-red-50 text-red-700';
      case 'change_request': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'approved_for_engineering': return 'bg-blue-100 text-blue-800';
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
          <CheckCircle className="h-8 w-8" />
          Ticket Review
        </h1>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending_review">Pending Review</SelectItem>
              <SelectItem value="closed">Closed Tickets</SelectItem>
              <SelectItem value="approved_for_engineering">Approved for Engineering</SelectItem>
              <SelectItem value="all">All Tickets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets Awaiting Review ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Review and manage tickets before they are assigned to engineering teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Time Down</TableHead>
                  <TableHead>Follow Up</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(ticket.type)}>
                        {ticket.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
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
                        {ticket.status.replace('_', ' ').toUpperCase()}
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
                        {ticket.reportedBy}
                      </div>
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{ticket.timeDown || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.followUpNeeded ? "destructive" : "secondary"}>
                        {ticket.followUpNeeded ? 'Required' : 'Not Required'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.status === 'pending_review' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseTicket(ticket.id, ticket.title);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Close
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveForEngineering(ticket.id, ticket.title);
                            }}
                          >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No {statusFilter.replace('_', ' ')} tickets found.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketReview;

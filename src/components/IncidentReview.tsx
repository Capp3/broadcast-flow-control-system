
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calendar, Clock, User, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for incident review
const mockIncidents = [
  {
    id: 'INC-001',
    title: 'Transmitter Power Failure - Studio A',
    description: 'Main transmitter lost power during morning broadcast',
    status: 'pending_review',
    priority: 'high',
    reportedBy: 'Mike Operator',
    createdAt: '2024-06-14T08:30:00Z',
    category: 'Equipment Failure',
    downtime: '45 minutes'
  },
  {
    id: 'INC-002',
    title: 'Audio Distortion on FM Channel',
    description: 'Listeners reporting audio quality issues on 101.5 FM',
    status: 'pending_review',
    priority: 'high',
    reportedBy: 'Dave Operator',
    createdAt: '2024-06-14T11:30:00Z',
    category: 'Signal Quality',
    downtime: 'Ongoing'
  },
  {
    id: 'INC-003',
    title: 'User Error - Wrong Playlist',
    description: 'Operator accidentally loaded wrong playlist for morning show',
    status: 'reviewed',
    priority: 'low',
    reportedBy: 'Lisa Operator',
    createdAt: '2024-06-14T09:15:00Z',
    category: 'User Error',
    downtime: '5 minutes'
  }
];

const IncidentReview = () => {
  const [statusFilter, setStatusFilter] = useState('pending_review');
  const [incidents, setIncidents] = useState(mockIncidents);
  const { toast } = useToast();

  const filteredIncidents = incidents.filter(incident => 
    statusFilter === 'all' ? true : incident.status === statusFilter
  );

  const handleApprove = (incidentId: string, title: string) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => 
        incident.id === incidentId 
          ? { ...incident, status: 'approved' }
          : incident
      )
    );
    
    toast({
      title: "Incident Approved",
      description: `Incident ${incidentId} has been approved for resolution.`,
    });
  };

  const handleReject = (incidentId: string, title: string) => {
    setIncidents(prevIncidents => 
      prevIncidents.map(incident => 
        incident.id === incidentId 
          ? { ...incident, status: 'rejected' }
          : incident
      )
    );
    
    toast({
      title: "Incident Rejected",
      description: `Incident ${incidentId} has been rejected and closed.`,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Incident Review
          </h2>
          <p className="text-muted-foreground">
            Review and manage incident reports requiring management attention
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="all">All Incidents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Reports ({filteredIncidents.length})</CardTitle>
          <CardDescription>
            Review incident reports and determine appropriate actions
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
                  <TableHead>Reported By</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Downtime</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{incident.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {incident.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {incident.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {incident.reportedBy}
                      </div>
                    </TableCell>
                    <TableCell>{incident.category}</TableCell>
                    <TableCell>{incident.downtime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(incident.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {incident.status === 'pending_review' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(incident.id, incident.title)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(incident.id, incident.title)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredIncidents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No {statusFilter.replace('_', ' ')} incidents found.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentReview;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Wrench, FileText, Settings, Calendar, Clock, User, Building, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TicketDetailProps {
  ticket: any;
  ticketType: 'service' | 'incident' | 'change' | 'report';
  isOpen: boolean;
  onClose: () => void;
  onSubmitForApproval?: (ticketId: string, notes: string) => void;
}

const TicketDetail = ({ ticket, ticketType, isOpen, onClose, onSubmitForApproval }: TicketDetailProps) => {
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  if (!ticket) return null;

  const getTicketIcon = () => {
    switch (ticketType) {
      case 'service': return <Wrench className="h-5 w-5" />;
      case 'incident': return <AlertTriangle className="h-5 w-5" />;
      case 'change': return <Settings className="h-5 w-5" />;
      case 'report': return <FileText className="h-5 w-5" />;
    }
  };

  const getTicketTypeLabel = () => {
    switch (ticketType) {
      case 'service': return 'Service Ticket';
      case 'incident': return 'Incident Ticket';
      case 'change': return 'Change Request';
      case 'report': return 'Incident Report';
    }
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
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitForApproval = () => {
    if (onSubmitForApproval && notes.trim()) {
      onSubmitForApproval(ticket.id, notes);
      toast({
        title: "Submitted for Approval",
        description: `${getTicketTypeLabel()} ${ticket.id} has been submitted for manager approval.`,
      });
      onClose();
    } else {
      toast({
        title: "Notes Required",
        description: "Please add completion notes before submitting for approval.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTicketIcon()}
            {getTicketTypeLabel()} - {ticket.id}
          </DialogTitle>
          <DialogDescription>
            {ticket.title}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Status and Priority */}
            <div className="flex gap-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority?.toUpperCase() || 'MEDIUM'}
                </Badge>
              </div>
              {ticket.category && (
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Badge variant="outline">{ticket.category}</Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Main Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                  </div>
                  
                  {ticket.businessJustification && (
                    <div>
                      <Label className="text-sm font-medium">Business Justification</Label>
                      <p className="text-sm text-muted-foreground mt-1">{ticket.businessJustification}</p>
                    </div>
                  )}

                  {ticket.impactAssessment && (
                    <div>
                      <Label className="text-sm font-medium">Impact Assessment</Label>
                      <p className="text-sm text-muted-foreground mt-1">{ticket.impactAssessment}</p>
                    </div>
                  )}

                  {ticket.changeType && (
                    <div>
                      <Label className="text-sm font-medium">Change Type</Label>
                      <p className="text-sm text-muted-foreground mt-1">{ticket.changeType}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Assignment & Timing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Assigned To</Label>
                        <p className="text-sm text-muted-foreground">{ticket.assignedTo}</p>
                      </div>
                    </div>
                  )}

                  {ticket.reportedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Reported By</Label>
                        <p className="text-sm text-muted-foreground">{ticket.reportedBy}</p>
                      </div>
                    </div>
                  )}

                  {ticket.requestedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Requested By</Label>
                        <p className="text-sm text-muted-foreground">{ticket.requestedBy}</p>
                      </div>
                    </div>
                  )}

                  {ticket.facility && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Facility</Label>
                        <p className="text-sm text-muted-foreground">{ticket.facility}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <Label className="text-sm font-medium">Created</Label>
                      <p className="text-sm text-muted-foreground">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p className="text-sm text-muted-foreground">{formatDate(ticket.updatedAt)}</p>
                    </div>
                  </div>

                  {ticket.proposedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Proposed Date</Label>
                        <p className="text-sm text-muted-foreground">{formatDate(ticket.proposedDate)}</p>
                      </div>
                    </div>
                  )}

                  {ticket.estimatedHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Estimated Hours</Label>
                        <p className="text-sm text-muted-foreground">{ticket.estimatedHours}h</p>
                      </div>
                    </div>
                  )}

                  {ticket.estimatedDuration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <div>
                        <Label className="text-sm font-medium">Estimated Duration</Label>
                        <p className="text-sm text-muted-foreground">{ticket.estimatedDuration}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Work Notes</CardTitle>
                <CardDescription>
                  Add your completion notes and findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Completion Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe the work performed, findings, and any recommendations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          
          {ticket.status === 'open' && onSubmitForApproval && (
            <Button onClick={handleSubmitForApproval}>
              Submit for Approval
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetail;

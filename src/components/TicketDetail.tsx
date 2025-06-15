import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Wrench, FileText, Settings, Calendar, Clock, User, Building, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TicketDetailProps {
  ticket: any;
  ticketType: 'service' | 'incident' | 'change' | 'report';
  isOpen: boolean;
  onClose: () => void;
  onSubmitForApproval?: (ticketId: string, completionNotes: string) => void;
}

const TicketDetail = ({ ticket, ticketType, isOpen, onClose, onSubmitForApproval }: TicketDetailProps) => {
  const [workNotes, setWorkNotes] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'project': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'routine': return 'bg-green-100 text-green-800 border-green-200';
      case 'audit': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'repair': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveWorkNotes = () => {
    // This would typically make an API call to save work notes
    toast({
      title: "Work Notes Saved",
      description: "Your work notes have been saved successfully.",
    });
  };

  const handleSubmitForApproval = () => {
    if (completionNotes.trim()) {
      if (onSubmitForApproval) {
        onSubmitForApproval(ticket.id, completionNotes);
      }
      toast({
        title: "Submitted for Approval",
        description: `${getTicketTypeLabel()} ${ticket.id} has been submitted for manager approval.`,
      });
      setShowCompletionDialog(false);
      onClose();
    } else {
      toast({
        title: "Completion Notes Required",
        description: "Please add completion notes before submitting for approval.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getTicketIcon()}
              {getTicketTypeLabel()} - {ticket.id}
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2">
                <span>{ticket.title}</span>
                {ticket.facility && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">{ticket.facility}</span>
                    </div>
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {/* Status Tags - Improved Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</Label>
                  <Badge className={`${getStatusColor(ticket.status)} border justify-center py-1.5`}>
                    {ticket.status?.toUpperCase() || 'UNKNOWN'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Priority</Label>
                  <Badge className={`${getPriorityColor(ticket.priority)} border justify-center py-1.5`}>
                    {ticket.priority?.toUpperCase() || 'MEDIUM'}
                  </Badge>
                </div>

                {ticket.type && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</Label>
                    <Badge className={`${getTypeColor(ticket.type)} border justify-center py-1.5`}>
                      {ticket.type?.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {ticket.category && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</Label>
                    <Badge variant="outline" className="justify-center py-1.5 border-gray-200">
                      {ticket.category}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Facility Badge - More Prominent */}
              {ticket.facility && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Facility</Label>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">{ticket.facility}</span>
                  </div>
                </div>
              )}

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

              {/* Work Notes Section - Always Available */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Notes</CardTitle>
                  <CardDescription>
                    Add ongoing work notes and progress updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="work-notes">Work Progress & Updates</Label>
                      <Textarea
                        id="work-notes"
                        placeholder="Document your work progress, findings, troubleshooting steps..."
                        value={workNotes}
                        onChange={(e) => setWorkNotes(e.target.value)}
                        className="min-h-32"
                      />
                    </div>
                    <Button onClick={handleSaveWorkNotes} variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save Work Notes
                    </Button>
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
              <Button onClick={() => setShowCompletionDialog(true)}>
                Submit for Approval
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Notes Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete {getTicketTypeLabel()}</DialogTitle>
            <DialogDescription>
              Add completion notes summarizing the work performed and resolution details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="completion-notes">Completion Summary</Label>
              <Textarea
                id="completion-notes"
                placeholder="Summarize the work completed, resolution details, and any recommendations..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCompletionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitForApproval}>
              Submit for Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketDetail;

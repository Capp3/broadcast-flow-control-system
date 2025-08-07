import NewServiceRequestDialog from "@/components/NewServiceRequestDialog";
import TicketDetail from "@/components/TicketDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Building, Calendar, Clock, User, Wrench } from "lucide-react";
import { useState } from "react";

interface ServiceTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  requestedBy: string;
  facility: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  type: string;
  estimatedHours: number;
}

// Mock data for service tickets
const mockServiceTickets = [
  {
    id: "SRV-001",
    title: "Antenna Maintenance - Tower 2",
    description: "Scheduled maintenance for primary antenna system",
    status: "open",
    priority: "medium",
    assignedTo: "John Engineer",
    requestedBy: "Mike Operator",
    facility: "Main Transmission Tower",
    createdAt: "2024-06-14T09:00:00Z",
    updatedAt: "2024-06-14T09:30:00Z",
    category: "Maintenance",
    type: "scheduled",
    estimatedHours: 4,
  },
  {
    id: "SRV-002",
    title: "Audio Processing Unit Upgrade",
    description: "Install new digital audio processing equipment",
    status: "open",
    priority: "high",
    assignedTo: "Sarah Tech",
    requestedBy: "Engineering Team",
    facility: "Studio A",
    createdAt: "2024-06-14T10:15:00Z",
    updatedAt: "2024-06-14T11:00:00Z",
    category: "Upgrade",
    type: "project",
    estimatedHours: 8,
  },
  {
    id: "SRV-003",
    title: "Generator Oil Change",
    description: "Routine oil change for backup generator",
    status: "closed",
    priority: "low",
    assignedTo: "Tom Maintenance",
    requestedBy: "Maintenance Schedule",
    facility: "Server Room",
    createdAt: "2024-06-13T08:00:00Z",
    updatedAt: "2024-06-13T10:30:00Z",
    category: "Maintenance",
    type: "routine",
    estimatedHours: 2,
  },
  {
    id: "SRV-004",
    title: "Network Infrastructure Review",
    description: "Security audit and performance optimization",
    status: "open",
    priority: "medium",
    assignedTo: "Alex Network",
    requestedBy: "IT Security",
    facility: "Control Room A",
    createdAt: "2024-06-14T13:00:00Z",
    updatedAt: "2024-06-14T13:15:00Z",
    category: "Security",
    type: "audit",
    estimatedHours: 6,
  },
  {
    id: "SRV-005",
    title: "Studio Lighting Replacement",
    description: "Replace LED panels in Studio B",
    status: "closed",
    priority: "low",
    assignedTo: "Bob Electrician",
    requestedBy: "Studio Manager",
    facility: "Studio B",
    createdAt: "2024-06-12T14:00:00Z",
    updatedAt: "2024-06-13T16:00:00Z",
    category: "Facilities",
    type: "repair",
    estimatedHours: 3,
  },
];

const ServiceTickets = () => {
  const [statusFilter, setStatusFilter] = useState("open");
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const { toast } = useToast();

  const filteredTickets = mockServiceTickets.filter((ticket) =>
    statusFilter === "all" ? true : ticket.status === statusFilter,
  );

  const handleTicketClick = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  const handleSubmitForApproval = (ticketId: string, notes: string) => {
    // This would typically make an API call to submit for approval
    console.log("Submitting ticket for approval:", ticketId, notes);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "project":
        return "bg-indigo-100 text-indigo-800";
      case "routine":
        return "bg-green-100 text-green-800";
      case "audit":
        return "bg-orange-100 text-orange-800";
      case "repair":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wrench className="h-8 w-8" />
          Service Tickets
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
          <Button onClick={() => setIsNewRequestOpen(true)}>
            <Wrench className="h-4 w-4 mr-2" />
            New Service Request
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>
            Manage engineering tasks, maintenance, and service requests. Click
            on a row to view details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Est. Hours</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleTicketClick(ticket)}
                  >
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
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">{ticket.facility}</span>
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
                      <Badge className={getTypeColor(ticket.type)}>
                        {ticket.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {ticket.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {ticket.estimatedHours}h
                      </div>
                    </TableCell>
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
                No {statusFilter} service tickets found.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <TicketDetail
        ticket={selectedTicket}
        ticketType="service"
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSubmitForApproval={handleSubmitForApproval}
      />

      <NewServiceRequestDialog
        open={isNewRequestOpen}
        onOpenChange={setIsNewRequestOpen}
      />
    </div>
  );
};

export default ServiceTickets;

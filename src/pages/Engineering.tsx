
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  Calendar,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for ticket summaries
const ticketSummary = {
  incidents: {
    total: 4,
    high: 2,
    medium: 1,
    low: 1,
    open: 4,
    closed: 8
  },
  service: {
    total: 3,
    high: 1,
    medium: 2,
    low: 0,
    open: 3,
    closed: 5
  },
  pending_review: {
    total: 5,
    high: 2,
    medium: 2,
    low: 1
  }
};

// Mock data for today's schedule
const todaySchedule = [
  {
    time: '09:00',
    title: 'System Maintenance - Server Room',
    type: 'maintenance',
    duration: '2 hours',
    assignee: 'John Engineer'
  },
  {
    time: '11:30',
    title: 'Audio Equipment Inspection - Studio A',
    type: 'inspection',
    duration: '1 hour',
    assignee: 'Sarah Tech'
  },
  {
    time: '14:00',
    title: 'Network Security Audit',
    type: 'audit',
    duration: '3 hours',
    assignee: 'Alex Network'
  },
  {
    time: '16:30',
    title: 'Backup Generator Test',
    type: 'testing',
    duration: '30 minutes',
    assignee: 'Tom Maintenance'
  }
];

const Engineering = () => {
  const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'audit': return 'bg-orange-100 text-orange-800';
      case 'testing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Engineering Dashboard
        </h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/incident-tickets')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketSummary.incidents.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">H: {ticketSummary.incidents.high}</Badge>
              <Badge variant="secondary" className="text-xs">M: {ticketSummary.incidents.medium}</Badge>
              <Badge variant="outline" className="text-xs">L: {ticketSummary.incidents.low}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {ticketSummary.incidents.open} open, {ticketSummary.incidents.closed} closed this week
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/service-tickets')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketSummary.service.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">H: {ticketSummary.service.high}</Badge>
              <Badge variant="secondary" className="text-xs">M: {ticketSummary.service.medium}</Badge>
              <Badge variant="outline" className="text-xs">L: {ticketSummary.service.low}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {ticketSummary.service.open} open, {ticketSummary.service.closed} closed this week
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/ticket-review')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketSummary.pending_review.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">H: {ticketSummary.pending_review.high}</Badge>
              <Badge variant="secondary" className="text-xs">M: {ticketSummary.pending_review.medium}</Badge>
              <Badge variant="outline" className="text-xs">L: {ticketSummary.pending_review.low}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting management approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">On Time</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. resolution: 4.2 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              Planned maintenance and engineering tasks for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{formatTime(item.time)}</span>
                      <Badge className={getTypeColor(item.type)} variant="secondary">
                        {item.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">
                      <Users className="h-3 w-3 inline mr-1" />
                      {item.assignee} • {item.duration}
                    </div>
                  </div>
                </div>
              ))}
              {todaySchedule.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No scheduled tasks for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common engineering tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/service-tickets')}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Create Service Request
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/incident-tickets')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report New Incident
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/system-check')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              System Health Check
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/scheduling')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            High Priority Alerts
          </CardTitle>
          <CardDescription>
            Critical issues requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
              <div>
                <div className="font-medium text-red-900">Transmitter Power Failure - Studio A</div>
                <div className="text-sm text-red-700">Reported 2 hours ago • Assigned to John Engineer</div>
              </div>
              <Button size="sm" onClick={() => navigate('/incident-tickets')}>
                View Details
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
              <div>
                <div className="font-medium text-orange-900">Network Connectivity Issues</div>
                <div className="text-sm text-orange-700">Reported 1 hour ago • Assigned to Alex Network</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/incident-tickets')}>
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Engineering;

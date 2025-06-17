import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TimeClockApproval from '@/components/TimeClockApproval';

// Mock data for management metrics
const kpiData = {
  totalEmployees: 24,
  activeEmployees: 22,
  onLeave: 2,
  avgUtilization: 87,
  utilizationTrend: 5.2,
  monthlyBudget: 125000,
  currentSpend: 98450,
  budgetUtilization: 78.8,
  incidentResolution: {
    avgTime: 4.2,
    target: 6.0,
    trend: -1.1
  },
  serviceCompletion: {
    rate: 94.3,
    target: 90.0,
    trend: 2.1
  }
};

const departmentMetrics = [
  {
    name: 'Engineering',
    employees: 8,
    utilization: 92,
    avgCost: 85000,
    performance: 'excellent',
    openTickets: 7
  },
  {
    name: 'Operations',
    employees: 12,
    utilization: 85,
    avgCost: 65000,
    performance: 'good',
    openTickets: 3
  },
  {
    name: 'Maintenance',
    employees: 4,
    utilization: 88,
    avgCost: 55000,
    performance: 'good',
    openTickets: 2
  }
];

const recentAlerts = [
  {
    type: 'budget',
    message: 'Engineering department approaching 90% budget utilization',
    severity: 'warning',
    time: '2 hours ago'
  },
  {
    type: 'performance',
    message: 'Service completion rate exceeded target for 3rd consecutive month',
    severity: 'success',
    time: '1 day ago'
  },
  {
    type: 'staffing',
    message: '2 employees on unexpected leave - consider backup coverage',
    severity: 'warning',
    time: '3 hours ago'
  }
];

const Management = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Management Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Strategic overview and operational insights for broadcast operations
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.avgUtilization}%</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{kpiData.utilizationTrend}%</span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.budgetUtilization}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatCurrency(kpiData.currentSpend)} of {formatCurrency(kpiData.monthlyBudget)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Resolution</CardTitle>
            <Target className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.incidentResolution.avgTime}h</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{kpiData.incidentResolution.trend}h</span>
              <span className="text-xs text-muted-foreground">vs target {kpiData.incidentResolution.target}h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Completion</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.serviceCompletion.rate}%</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{kpiData.serviceCompletion.trend}%</span>
              <span className="text-xs text-muted-foreground">vs target {kpiData.serviceCompletion.target}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="time-approval">Time Clock Approval</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>
                  Team metrics and utilization by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentMetrics.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{dept.name}</span>
                          <Badge className={getPerformanceColor(dept.performance)}>
                            {dept.performance.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="block">Staff: {dept.employees}</span>
                            <span className="block">Util: {dept.utilization}%</span>
                          </div>
                          <div>
                            <span className="block">Avg Cost: {formatCurrency(dept.avgCost)}</span>
                          </div>
                          <div>
                            <span className="block">Open Tickets: {dept.openTickets}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Management Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common management tasks and reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/employees')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Employee Management
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/scheduling')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedules
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/ticket-review')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Pending Tickets
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/reports')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/settings')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts and Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Management Alerts
              </CardTitle>
              <CardDescription>
                Important notifications requiring management attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className={`flex items-start justify-between p-3 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <div className="flex-1">
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {alert.time}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-approval">
          <TimeClockApproval />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Advanced analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Management;

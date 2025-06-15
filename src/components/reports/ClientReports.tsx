
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  Download, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown
} from 'lucide-react';

// Mock data for client reports
const failureData = [
  { month: 'Jan', failures: 12, resolved: 11, pending: 1 },
  { month: 'Feb', failures: 8, resolved: 8, pending: 0 },
  { month: 'Mar', failures: 15, resolved: 13, pending: 2 },
  { month: 'Apr', failures: 6, resolved: 6, pending: 0 },
  { month: 'May', failures: 10, resolved: 9, pending: 1 },
  { month: 'Jun', failures: 7, resolved: 7, pending: 0 }
];

const uptimeData = [
  { day: 'Mon', uptime: 99.2 },
  { day: 'Tue', uptime: 99.8 },
  { day: 'Wed', uptime: 98.5 },
  { day: 'Thu', uptime: 99.9 },
  { day: 'Fri', uptime: 99.1 },
  { day: 'Sat', uptime: 99.7 },
  { day: 'Sun', uptime: 99.9 }
];

const failureTypeData = [
  { name: 'Hardware', value: 35, color: '#ef4444' },
  { name: 'Software', value: 28, color: '#f97316' },
  { name: 'Network', value: 20, color: '#eab308' },
  { name: 'Human Error', value: 17, color: '#22c55e' }
];

const recentFailures = [
  {
    id: 'F-2024-001',
    date: '2024-06-10',
    type: 'Hardware',
    severity: 'High',
    description: 'Primary server cooling system failure',
    duration: '2.5h',
    status: 'Resolved'
  },
  {
    id: 'F-2024-002',
    date: '2024-06-08',
    type: 'Software',
    severity: 'Medium',
    description: 'Database connection timeout',
    duration: '45m',
    status: 'Resolved'
  },
  {
    id: 'F-2024-003',
    date: '2024-06-05',
    type: 'Network',
    severity: 'Low',
    description: 'Intermittent connectivity issues',
    duration: '1.2h',
    status: 'Resolved'
  }
];

const chartConfig = {
  failures: {
    label: "Failures",
    color: "hsl(var(--chart-1))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
  uptime: {
    label: "Uptime %",
    color: "hsl(var(--chart-4))",
  },
};

const ClientReports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2024-01-01',
    to: '2024-06-30'
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateClientReport = () => {
    console.log('Generating client report for date range:', dateRange);
    // This would trigger the report generation
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report Parameters
          </CardTitle>
          <CardDescription>
            Select date range and generate client-facing reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <Button onClick={generateClientReport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failure Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Failure Trends</CardTitle>
            <CardDescription>Monthly failure and resolution statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={failureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="failures" fill="var(--color-failures)" />
                <Bar dataKey="resolved" fill="var(--color-resolved)" />
                <Bar dataKey="pending" fill="var(--color-pending)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Uptime Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Uptime</CardTitle>
            <CardDescription>Weekly uptime percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart data={uptimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={['98', '100']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="var(--color-uptime)" 
                  strokeWidth={3}
                  dot={{ fill: "var(--color-uptime)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Failure Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Failure Distribution</CardTitle>
            <CardDescription>Breakdown by failure type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={failureTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {failureTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Current period summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Service Availability</span>
              </div>
              <span className="text-lg font-bold text-green-600">99.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Mean Time to Repair</span>
              </div>
              <span className="text-lg font-bold">1.8h</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Incidents This Month</span>
              </div>
              <span className="text-lg font-bold">7</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Critical Issues</span>
              </div>
              <span className="text-lg font-bold text-red-600">1</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Failures Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Failures</CardTitle>
          <CardDescription>
            Detailed list of recent system failures and resolutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFailures.map((failure) => (
              <div key={failure.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-medium">{failure.id}</span>
                    <Badge className={getSeverityColor(failure.severity)}>
                      {failure.severity}
                    </Badge>
                    <Badge variant="outline">{failure.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{failure.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Date: {failure.date}</span>
                    <span>Duration: {failure.duration}</span>
                    <span>Status: {failure.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientReports;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  Activity,
  Target,
  Calendar,
  Download
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [department, setDepartment] = useState('all');

  // Mock analytics data
  const performanceMetrics = {
    utilization: { current: 87, previous: 82, trend: 5.2 },
    productivity: { current: 94, previous: 91, trend: 3.1 },
    costEfficiency: { current: 78, previous: 75, trend: 3.0 },
    incidentRate: { current: 2.1, previous: 2.8, trend: -0.7 }
  };

  const departmentAnalytics = [
    {
      name: 'Engineering',
      efficiency: 92,
      costPerHour: 85,
      incidentResolution: 3.2,
      utilization: 89,
      trend: 'up'
    },
    {
      name: 'Operations',
      efficiency: 88,
      costPerHour: 65,
      incidentResolution: 4.1,
      utilization: 85,
      trend: 'up'
    },
    {
      name: 'Maintenance',
      efficiency: 85,
      costPerHour: 55,
      incidentResolution: 5.2,
      utilization: 82,
      trend: 'stable'
    }
  ];

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Detailed performance metrics and trend analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.utilization.current}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(performanceMetrics.utilization.trend)}
              <span className="text-xs text-green-600">+{performanceMetrics.utilization.trend}%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.productivity.current}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(performanceMetrics.productivity.trend)}
              <span className="text-xs text-green-600">+{performanceMetrics.productivity.trend}%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.costEfficiency.current}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(performanceMetrics.costEfficiency.trend)}
              <span className="text-xs text-green-600">+{performanceMetrics.costEfficiency.trend}%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incident Rate</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.incidentRate.current}/day</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">{performanceMetrics.incidentRate.trend}</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Performance Analysis
              </CardTitle>
              <CardDescription>
                Detailed breakdown of department-level metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentAnalytics.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{dept.name}</h3>
                      <Badge className={getTrendColor(dept.trend)}>
                        {dept.trend.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{dept.efficiency}%</div>
                        <div className="text-sm text-muted-foreground">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">${dept.costPerHour}</div>
                        <div className="text-sm text-muted-foreground">Cost/Hour</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{dept.incidentResolution}h</div>
                        <div className="text-sm text-muted-foreground">Avg Resolution</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{dept.utilization}%</div>
                        <div className="text-sm text-muted-foreground">Utilization</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Historical performance data and trend analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Trend analysis charts will be implemented here...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Forecasting</CardTitle>
              <CardDescription>
                AI-powered predictions for resource planning and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Forecasting models will be implemented here...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

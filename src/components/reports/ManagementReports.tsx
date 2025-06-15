
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle
} from 'lucide-react';

// Mock data for management reports
const employeePerformance = [
  { name: 'John Smith', tickets: 45, avgTime: 3.2, efficiency: 92, department: 'Engineering' },
  { name: 'Sarah Johnson', tickets: 38, avgTime: 2.8, efficiency: 95, department: 'Operations' },
  { name: 'Mike Wilson', tickets: 32, avgTime: 4.1, efficiency: 88, department: 'Maintenance' },
  { name: 'Lisa Brown', tickets: 41, avgTime: 3.5, efficiency: 90, department: 'Engineering' },
  { name: 'Dave Miller', tickets: 29, avgTime: 3.8, efficiency: 87, department: 'Operations' }
];

const costAnalysis = [
  { month: 'Jan', labor: 45000, materials: 12000, overhead: 8000, total: 65000 },
  { month: 'Feb', labor: 42000, materials: 15000, overhead: 8500, total: 65500 },
  { month: 'Mar', labor: 48000, materials: 11000, overhead: 9000, total: 68000 },
  { month: 'Apr', labor: 44000, materials: 13000, overhead: 8200, total: 65200 },
  { month: 'May', labor: 46000, materials: 14000, overhead: 8800, total: 68800 },
  { month: 'Jun', labor: 43000, materials: 12500, overhead: 8300, total: 63800 }
];

const departmentUtilization = [
  { department: 'Engineering', utilization: 92, capacity: 100, efficiency: 94 },
  { department: 'Operations', utilization: 87, capacity: 100, efficiency: 91 },
  { department: 'Maintenance', utilization: 78, capacity: 100, efficiency: 89 },
  { department: 'Management', utilization: 65, capacity: 100, efficiency: 88 }
];

const payrollData = [
  { 
    employee: 'John Smith', 
    department: 'Engineering',
    regularHours: 160, 
    overtimeHours: 12, 
    regularRate: 45, 
    overtimeRate: 67.5,
    totalPay: 8010,
    benefits: 1200
  },
  { 
    employee: 'Sarah Johnson', 
    department: 'Operations',
    regularHours: 160, 
    overtimeHours: 8, 
    regularRate: 38, 
    overtimeRate: 57,
    totalPay: 6536,
    benefits: 980
  },
  { 
    employee: 'Mike Wilson', 
    department: 'Maintenance',
    regularHours: 160, 
    overtimeHours: 15, 
    regularRate: 35, 
    overtimeRate: 52.5,
    totalPay: 6387.5,
    benefits: 850
  }
];

const chartConfig = {
  labor: { label: "Labor", color: "hsl(var(--chart-1))" },
  materials: { label: "Materials", color: "hsl(var(--chart-2))" },
  overhead: { label: "Overhead", color: "hsl(var(--chart-3))" },
  total: { label: "Total", color: "hsl(var(--chart-4))" },
  utilization: { label: "Utilization", color: "hsl(var(--chart-5))" },
  efficiency: { label: "Efficiency", color: "hsl(var(--chart-1))" },
};

const ManagementReports = () => {
  const [activeView, setActiveView] = useState("performance");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportPayrollData = () => {
    console.log('Exporting payroll data for HR system');
    // This would generate CSV/Excel export
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="utilization">Department Utilization</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Export</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Performance Analysis
              </CardTitle>
              <CardDescription>
                Individual performance metrics and efficiency ratings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeePerformance.map((employee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{employee.name}</span>
                        <Badge variant="outline">{employee.department}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>Tickets: {employee.tickets}</div>
                        <div>Avg Time: {employee.avgTime}h</div>
                        <div>Efficiency: {employee.efficiency}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {employee.efficiency >= 90 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost Breakdown</CardTitle>
                <CardDescription>Labor, materials, and overhead costs</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart data={costAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="labor" stackId="1" fill="var(--color-labor)" />
                    <Area type="monotone" dataKey="materials" stackId="1" fill="var(--color-materials)" />
                    <Area type="monotone" dataKey="overhead" stackId="1" fill="var(--color-overhead)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Summary</CardTitle>
                <CardDescription>Current period financial overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Total Budget</span>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(400000)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">YTD Spending</span>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(396300)}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Budget Utilization</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">99.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Utilization</CardTitle>
              <CardDescription>Resource utilization and efficiency by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={departmentUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="utilization" fill="var(--color-utilization)" />
                  <Bar dataKey="efficiency" fill="var(--color-efficiency)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payroll Export Data
                </div>
                <Button onClick={exportPayrollData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export to HR System
                </Button>
              </CardTitle>
              <CardDescription>
                Structured payroll data ready for HR system import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-right p-2">Regular Hours</th>
                      <th className="text-right p-2">Overtime Hours</th>
                      <th className="text-right p-2">Regular Rate</th>
                      <th className="text-right p-2">OT Rate</th>
                      <th className="text-right p-2">Total Pay</th>
                      <th className="text-right p-2">Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{row.employee}</td>
                        <td className="p-2">{row.department}</td>
                        <td className="p-2 text-right">{row.regularHours}</td>
                        <td className="p-2 text-right">{row.overtimeHours}</td>
                        <td className="p-2 text-right">${row.regularRate}</td>
                        <td className="p-2 text-right">${row.overtimeRate}</td>
                        <td className="p-2 text-right font-bold">${row.totalPay}</td>
                        <td className="p-2 text-right">${row.benefits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Export Formats Available:</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="outline">CSV Format</Badge>
                  <Badge variant="outline">Excel (.xlsx)</Badge>
                  <Badge variant="outline">JSON Data</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagementReports;

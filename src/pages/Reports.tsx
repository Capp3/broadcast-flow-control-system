
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Settings,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  Clock,
  Target
} from 'lucide-react';
import ClientReports from '../components/reports/ClientReports';
import ManagementReports from '../components/reports/ManagementReports';
import ReportSettings from '../components/reports/ReportSettings';
import RotaReport from '../components/reports/RotaReport';
import ExportDialog from '../components/reports/ExportDialog';

// Mock data for report summary
const reportSummary = {
  totalReports: 156,
  thisMonth: 23,
  avgResolutionTime: 4.2,
  successRate: 94.3,
  criticalFailures: 7,
  recentTrends: {
    incidents: -12,
    resolution: -0.8,
    satisfaction: +2.1
  }
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState("client");
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive reporting for clients and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportSummary.totalReports}</div>
            <div className="text-xs text-muted-foreground">
              {reportSummary.thisMonth} this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportSummary.successRate}%</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+{reportSummary.recentTrends.satisfaction}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportSummary.avgResolutionTime}h</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{reportSummary.recentTrends.resolution}h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportSummary.criticalFailures}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{reportSummary.recentTrends.incidents}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="client">Client Reports</TabsTrigger>
          <TabsTrigger value="management">Management Reports</TabsTrigger>
          <TabsTrigger value="rota">Crew Rota</TabsTrigger>
          <TabsTrigger value="settings">Settings & Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-4">
          <ClientReports />
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <ManagementReports />
        </TabsContent>

        <TabsContent value="rota" className="space-y-4">
          <RotaReport />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <ReportSettings />
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <ExportDialog 
        open={showExportDialog} 
        onOpenChange={setShowExportDialog} 
      />
    </div>
  );
};

export default Reports;

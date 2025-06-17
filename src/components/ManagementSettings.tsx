
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Users, 
  Clock, 
  AlertTriangle,
  FileText,
  DollarSign,
  Bell,
  Shield,
  Calendar,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManagementSettings = () => {
  const { toast } = useToast();
  
  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'Broadcast Operations Inc.',
    defaultShiftHours: 8,
    overtimeThreshold: 40,
    autoApprovals: false,
    requireManagerApproval: true,
    emergencyNotifications: true,
    weekStartDay: 'monday'
  });

  // Approval Settings
  const [approvalSettings, setApprovalSettings] = useState({
    timeClockAutoApprove: false,
    maxHoursWithoutApproval: 10,
    requireIncidentApproval: true,
    budgetApprovalThreshold: 5000,
    changeRequestApproval: true
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    overdueTickets: true,
    budgetAlerts: true,
    staffingAlerts: true,
    systemAlerts: true
  });

  // Department Budget Settings
  const [budgets, setBudgets] = useState([
    { department: 'Engineering', budget: 85000, currentSpend: 78000 },
    { department: 'Operations', budget: 65000, currentSpend: 58000 },
    { department: 'Maintenance', budget: 45000, currentSpend: 41000 }
  ]);

  // Alert Thresholds
  const [alertThresholds, setAlertThresholds] = useState({
    budgetWarning: 80,
    budgetCritical: 95,
    utilizationLow: 60,
    utilizationHigh: 95,
    incidentEscalation: 24
  });

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleApprovalSettingChange = (key: string, value: any) => {
    setApprovalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleThresholdChange = (key: string, value: number) => {
    setAlertThresholds(prev => ({ ...prev, [key]: value }));
  };

  const handleBudgetChange = (index: number, field: string, value: number) => {
    setBudgets(prev => prev.map((budget, i) => 
      i === index ? { ...budget, [field]: value } : budget
    ));
  };

  const saveAllSettings = () => {
    console.log('Saving management settings:', {
      systemSettings,
      approvalSettings,
      notifications,
      budgets,
      alertThresholds
    });
    
    toast({
      title: "Settings Saved",
      description: "All management settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Management Settings
          </h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and operational parameters
          </p>
        </div>
        <Button onClick={saveAllSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Core system settings and defaults
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={systemSettings.companyName}
                onChange={(e) => handleSystemSettingChange('companyName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="default-hours">Default Shift Hours</Label>
              <Input
                id="default-hours"
                type="number"
                value={systemSettings.defaultShiftHours}
                onChange={(e) => handleSystemSettingChange('defaultShiftHours', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="overtime-threshold">Weekly Overtime Threshold</Label>
              <Input
                id="overtime-threshold"
                type="number"
                value={systemSettings.overtimeThreshold}
                onChange={(e) => handleSystemSettingChange('overtimeThreshold', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="week-start">Week Start Day</Label>
              <Select 
                value={systemSettings.weekStartDay} 
                onValueChange={(value) => handleSystemSettingChange('weekStartDay', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-approvals">Enable Auto-Approvals</Label>
              <Switch
                id="auto-approvals"
                checked={systemSettings.autoApprovals}
                onCheckedChange={(checked) => handleSystemSettingChange('autoApprovals', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Approval Workflows
            </CardTitle>
            <CardDescription>
              Configure approval requirements and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="timeclock-auto">Auto-approve Time Entries</Label>
              <Switch
                id="timeclock-auto"
                checked={approvalSettings.timeClockAutoApprove}
                onCheckedChange={(checked) => handleApprovalSettingChange('timeClockAutoApprove', checked)}
              />
            </div>

            <div>
              <Label htmlFor="max-hours">Max Hours Without Approval</Label>
              <Input
                id="max-hours"
                type="number"
                value={approvalSettings.maxHoursWithoutApproval}
                onChange={(e) => handleApprovalSettingChange('maxHoursWithoutApproval', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="budget-threshold">Budget Approval Threshold ($)</Label>
              <Input
                id="budget-threshold"
                type="number"
                value={approvalSettings.budgetApprovalThreshold}
                onChange={(e) => handleApprovalSettingChange('budgetApprovalThreshold', parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="incident-approval">Require Incident Approval</Label>
              <Switch
                id="incident-approval"
                checked={approvalSettings.requireIncidentApproval}
                onCheckedChange={(checked) => handleApprovalSettingChange('requireIncidentApproval', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="change-approval">Require Change Request Approval</Label>
              <Switch
                id="change-approval"
                checked={approvalSettings.changeRequestApproval}
                onCheckedChange={(checked) => handleApprovalSettingChange('changeRequestApproval', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Department Budgets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Department Budgets
            </CardTitle>
            <CardDescription>
              Manage budget allocations by department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{budget.department}</span>
                  <Badge variant="outline">
                    {Math.round((budget.currentSpend / budget.budget) * 100)}% used
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Budget</Label>
                    <Input
                      type="number"
                      value={budget.budget}
                      onChange={(e) => handleBudgetChange(index, 'budget', parseInt(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Current Spend</Label>
                    <Input
                      type="number"
                      value={budget.currentSpend}
                      onChange={(e) => handleBudgetChange(index, 'currentSpend', parseInt(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alert Thresholds
            </CardTitle>
            <CardDescription>
              Configure when alerts and warnings are triggered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="budget-warning">Budget Warning Threshold (%)</Label>
              <Input
                id="budget-warning"
                type="number"
                value={alertThresholds.budgetWarning}
                onChange={(e) => handleThresholdChange('budgetWarning', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="budget-critical">Budget Critical Threshold (%)</Label>
              <Input
                id="budget-critical"
                type="number"
                value={alertThresholds.budgetCritical}
                onChange={(e) => handleThresholdChange('budgetCritical', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="util-low">Low Utilization Alert (%)</Label>
              <Input
                id="util-low"
                type="number"
                value={alertThresholds.utilizationLow}
                onChange={(e) => handleThresholdChange('utilizationLow', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="util-high">High Utilization Alert (%)</Label>
              <Input
                id="util-high"
                type="number"
                value={alertThresholds.utilizationHigh}
                onChange={(e) => handleThresholdChange('utilizationHigh', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="incident-escalation">Incident Escalation (hours)</Label>
              <Input
                id="incident-escalation"
                type="number"
                value={alertThresholds.incidentEscalation}
                onChange={(e) => handleThresholdChange('incidentEscalation', parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch
                id="sms-notifications"
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="overdue-tickets">Overdue Ticket Alerts</Label>
              <Switch
                id="overdue-tickets"
                checked={notifications.overdueTickets}
                onCheckedChange={(checked) => handleNotificationChange('overdueTickets', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="budget-alerts">Budget Alerts</Label>
              <Switch
                id="budget-alerts"
                checked={notifications.budgetAlerts}
                onCheckedChange={(checked) => handleNotificationChange('budgetAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="staffing-alerts">Staffing Alerts</Label>
              <Switch
                id="staffing-alerts"
                checked={notifications.staffingAlerts}
                onCheckedChange={(checked) => handleNotificationChange('staffingAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="system-alerts">System Alerts</Label>
              <Switch
                id="system-alerts"
                checked={notifications.systemAlerts}
                onCheckedChange={(checked) => handleNotificationChange('systemAlerts', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementSettings;

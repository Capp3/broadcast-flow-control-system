import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Clock, DollarSign, Save, Settings, Users } from "lucide-react";
import { useState } from "react";

const ManagementSettings = () => {
  const [settings, setSettings] = useState({
    system: {
      autoApproveTimeunder: 8,
      requireManagerApproval: true,
      allowSelfScheduling: false,
      maxOvertimeHours: 12,
    },
    departments: {
      operations: { budget: 75000, alertThreshold: 80 },
      engineering: { budget: 125000, alertThreshold: 85 },
      maintenance: { budget: 45000, alertThreshold: 75 },
    },
    notifications: {
      budgetAlerts: true,
      overtimeAlerts: true,
      scheduleChanges: true,
      incidentEscalation: true,
      emailNotifications: true,
      alertThreshold: 80,
    },
    approval: {
      timeClockAutoApprove: false,
      vacationRequiresApproval: true,
      changeRequestAutoAssign: true,
      incidentEscalationTime: 4,
    },
  });

  const handleSave = () => {
    console.log("Saving management settings:", settings);
    // Here you would save to API
  };

  const updateSetting = (
    category: string,
    key: string,
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const updateDepartmentSetting = (
    dept: string,
    key: string,
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      departments: {
        ...prev.departments,
        [dept]: {
          ...prev.departments[dept as keyof typeof prev.departments],
          [key]: value,
        },
      },
    }));
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
            Configure system-wide settings and policies
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time & Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Auto-approve time entries under (hours)</Label>
              <Input
                type="number"
                value={settings.system.autoApproveTimeunder}
                onChange={(e) =>
                  updateSetting(
                    "system",
                    "autoApproveTimeunder",
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum overtime hours per day</Label>
              <Input
                type="number"
                value={settings.system.maxOvertimeHours}
                onChange={(e) =>
                  updateSetting(
                    "system",
                    "maxOvertimeHours",
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Require manager approval for all time entries</Label>
              <Switch
                checked={settings.system.requireManagerApproval}
                onCheckedChange={(checked) =>
                  updateSetting("system", "requireManagerApproval", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Allow employee self-scheduling</Label>
              <Switch
                checked={settings.system.allowSelfScheduling}
                onCheckedChange={(checked) =>
                  updateSetting("system", "allowSelfScheduling", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Approval Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-approve time clock entries</Label>
              <Switch
                checked={settings.approval.timeClockAutoApprove}
                onCheckedChange={(checked) =>
                  updateSetting("approval", "timeClockAutoApprove", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Vacation requests require approval</Label>
              <Switch
                checked={settings.approval.vacationRequiresApproval}
                onCheckedChange={(checked) =>
                  updateSetting("approval", "vacationRequiresApproval", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto-assign change requests</Label>
              <Switch
                checked={settings.approval.changeRequestAutoAssign}
                onCheckedChange={(checked) =>
                  updateSetting("approval", "changeRequestAutoAssign", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Incident escalation time (hours)</Label>
              <Input
                type="number"
                value={settings.approval.incidentEscalationTime}
                onChange={(e) =>
                  updateSetting(
                    "approval",
                    "incidentEscalationTime",
                    parseInt(e.target.value),
                  )
                }
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
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.departments).map(([dept, config]) => (
              <div key={dept} className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{dept}</span>
                  <Badge variant="outline">
                    {config.alertThreshold}% Alert
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Monthly Budget</Label>
                    <Input
                      type="number"
                      value={config.budget}
                      onChange={(e) =>
                        updateDepartmentSetting(
                          dept,
                          "budget",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Alert Threshold (%)</Label>
                    <Input
                      type="number"
                      value={config.alertThreshold}
                      onChange={(e) =>
                        updateDepartmentSetting(
                          dept,
                          "alertThreshold",
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Budget utilization alerts</Label>
              <Switch
                checked={settings.notifications.budgetAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "budgetAlerts", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Overtime alerts</Label>
              <Switch
                checked={settings.notifications.overtimeAlerts}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "overtimeAlerts", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Schedule change notifications</Label>
              <Switch
                checked={settings.notifications.scheduleChanges}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "scheduleChanges", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Incident escalation alerts</Label>
              <Switch
                checked={settings.notifications.incidentEscalation}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "incidentEscalation", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Email notifications</Label>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  updateSetting("notifications", "emailNotifications", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>General alert threshold (%)</Label>
              <Input
                type="number"
                value={settings.notifications.alertThreshold}
                onChange={(e) =>
                  updateSetting(
                    "notifications",
                    "alertThreshold",
                    parseInt(e.target.value),
                  )
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagementSettings;

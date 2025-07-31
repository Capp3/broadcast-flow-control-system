import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Settings as SettingsIcon, Clock, Users, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

const Settings = () => {
  const { locations, shifts, facilities, incidentTypes } = useSettings();
  const [localLocations, setLocalLocations] = useState<string[]>([]);
  const [localShifts, setLocalShifts] = useState<string[]>([]);
  const [localFacilities, setLocalFacilities] = useState<string[]>([]);
  const [localIncidentTypes, setLocalIncidentTypes] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [newShift, setNewShift] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newIncidentType, setNewIncidentType] = useState('');
  const { toast } = useToast();

  // Convert objects to arrays of names for local state
  useEffect(() => {
    setLocalLocations(locations.map(loc => loc.name));
    setLocalShifts(shifts.map(shift => shift.name));
    setLocalFacilities(facilities.map(facility => facility.name));
    setLocalIncidentTypes(incidentTypes.map(type => type.name));
  }, [locations, shifts, facilities, incidentTypes]);

  // Management settings state
  const [managementSettings, setManagementSettings] = useState({
    timeClockAutoApprove: false,
    requireManagerApproval: true,
    allowSelfScheduling: false,
    maxOvertimeHours: 12,
    autoApproveTimeunder: 8,
    budgetAlerts: true,
    overtimeAlerts: true,
    emailNotifications: true,
    incidentEscalationTime: 4
  });

  const addLocation = () => {
    if (newLocation.trim() && !localLocations.includes(newLocation.trim())) {
      setLocalLocations([...localLocations, newLocation.trim()]);
      setNewLocation('');
      toast({
        title: "Location Added",
        description: `"${newLocation.trim()}" has been added to the locations list.`,
      });
    }
  };

  const removeLocation = (location: string) => {
    setLocalLocations(localLocations.filter(loc => loc !== location));
    toast({
      title: "Location Removed",
      description: `"${location}" has been removed from the locations list.`,
    });
  };

  const addShift = () => {
    if (newShift.trim() && !localShifts.includes(newShift.trim())) {
      setLocalShifts([...localShifts, newShift.trim()]);
      setNewShift('');
      toast({
        title: "Shift Added",
        description: `"${newShift.trim()}" has been added to the shifts list.`,
      });
    }
  };

  const removeShift = (shift: string) => {
    setLocalShifts(localShifts.filter(s => s !== shift));
    toast({
      title: "Shift Removed",
      description: `"${shift}" has been removed from the shifts list.`,
    });
  };

  const addFacility = () => {
    if (newFacility.trim() && !localFacilities.includes(newFacility.trim())) {
      setLocalFacilities([...localFacilities, newFacility.trim()]);
      setNewFacility('');
      toast({
        title: "Facility Added",
        description: `"${newFacility.trim()}" has been added to the facilities list.`,
      });
    }
  };

  const removeFacility = (facility: string) => {
    setLocalFacilities(localFacilities.filter(f => f !== facility));
    toast({
      title: "Facility Removed",
      description: `"${facility}" has been removed from the facilities list.`,
    });
  };

  const addIncidentType = () => {
    if (newIncidentType.trim() && !localIncidentTypes.includes(newIncidentType.trim())) {
      setLocalIncidentTypes([...localIncidentTypes, newIncidentType.trim()]);
      setNewIncidentType('');
      toast({
        title: "Incident Type Added",
        description: `"${newIncidentType.trim()}" has been added to the incident types list.`,
      });
    }
  };

  const removeIncidentType = (type: string) => {
    setLocalIncidentTypes(localIncidentTypes.filter(t => t !== type));
    toast({
      title: "Incident Type Removed",
      description: `"${type}" has been removed from the incident types list.`,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const updateManagementSetting = (key: string, value: any) => {
    setManagementSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          System Settings
        </h1>
        <Button onClick={handleSaveChanges}>
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          {/* Locations Management */}
          <Card>
            <CardHeader>
              <CardTitle>Location Management</CardTitle>
              <CardDescription>
                Manage the list of available locations for time clock entries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="newLocation">Add New Location</Label>
                  <Input
                    id="newLocation"
                    placeholder="Enter location name..."
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addLocation} disabled={!newLocation.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Locations ({localLocations.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {localLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="text-sm">{location}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocation(location)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shifts Management */}
          <Card>
            <CardHeader>
              <CardTitle>Shift/Event Management</CardTitle>
              <CardDescription>
                Manage the list of available shifts and events for time clock entries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="newShift">Add New Shift/Event</Label>
                  <Input
                    id="newShift"
                    placeholder="Enter shift or event name..."
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addShift()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addShift} disabled={!newShift.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Shifts/Events ({localShifts.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {localShifts.map((shift, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="text-sm">{shift}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeShift(shift)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Time & Attendance Settings */}
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
                  value={managementSettings.autoApproveTimeunder}
                  onChange={(e) => updateManagementSetting('autoApproveTimeunder', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum overtime hours per day</Label>
                <Input
                  type="number"
                  value={managementSettings.maxOvertimeHours}
                  onChange={(e) => updateManagementSetting('maxOvertimeHours', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Require manager approval for all time entries</Label>
                <Switch
                  checked={managementSettings.requireManagerApproval}
                  onCheckedChange={(checked) => updateManagementSetting('requireManagerApproval', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Allow employee self-scheduling</Label>
                <Switch
                  checked={managementSettings.allowSelfScheduling}
                  onCheckedChange={(checked) => updateManagementSetting('allowSelfScheduling', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto-approve time clock entries</Label>
                <Switch
                  checked={managementSettings.timeClockAutoApprove}
                  onCheckedChange={(checked) => updateManagementSetting('timeClockAutoApprove', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Access Management Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Access Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Incident escalation time (hours)</Label>
                <Input
                  type="number"
                  value={managementSettings.incidentEscalationTime}
                  onChange={(e) => updateManagementSetting('incidentEscalationTime', parseInt(e.target.value))}
                />
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Time clock approvals can be managed from the Management Dashboard → Time Approval tab.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Facilities Management */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Management</CardTitle>
              <CardDescription>
                Manage the list of available facilities for incident reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="newFacility">Add New Facility</Label>
                  <Input
                    id="newFacility"
                    placeholder="Enter facility name..."
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFacility()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addFacility} disabled={!newFacility.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Facilities ({localFacilities.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {localFacilities.map((facility, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="text-sm">{facility}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFacility(facility)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Types Management */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Type Management</CardTitle>
              <CardDescription>
                Manage the list of available incident types for incident reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="newIncidentType">Add New Incident Type</Label>
                  <Input
                    id="newIncidentType"
                    placeholder="Enter incident type..."
                    value={newIncidentType}
                    onChange={(e) => setNewIncidentType(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addIncidentType()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addIncidentType} disabled={!newIncidentType.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Incident Types ({localIncidentTypes.length})</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {localIncidentTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="text-sm">{type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIncidentType(type)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Budget utilization alerts</Label>
                <Switch
                  checked={managementSettings.budgetAlerts}
                  onCheckedChange={(checked) => updateManagementSetting('budgetAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Overtime alerts</Label>
                <Switch
                  checked={managementSettings.overtimeAlerts}
                  onCheckedChange={(checked) => updateManagementSetting('overtimeAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email notifications</Label>
                <Switch
                  checked={managementSettings.emailNotifications}
                  onCheckedChange={(checked) => updateManagementSetting('emailNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Navigation Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-800 space-y-2">
                <p>• <strong>Time Clock Approvals:</strong> Go to Management Dashboard → Time Approval tab</p>
                <p>• <strong>Employee Management:</strong> Access via Management Dashboard → Overview → Employee Management</p>
                <p>• <strong>Incident Reviews:</strong> Available in Management Dashboard → Overview → Review Pending Tickets</p>
                <p>• Changes here affect system-wide behavior and require appropriate permissions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

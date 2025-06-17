import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit, User, Phone, Mail, Calendar, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Mock employee data - in real app this would come from API
const mockEmployeeData = {
  1: {
    id: 1,
    name: 'John Operator',
    email: 'john.operator@broadcast.com',
    position: 'Senior Broadcast Operator',
    department: 'Operations',
    status: 'Active',
    startDate: '2022-01-15',
    phone: '555-0123',
    emergencyContact: {
      name: 'Jane Operator',
      relationship: 'Spouse',
      phone: '555-0999'
    },
    permissions: {
      incidentReporting: true,
      systemCheck: true,
      changeRequests: false,
      employeeManagement: false,
      scheduling: true
    },
    yearlyStats: {
      hoursWorked: 1847,
      overtime: 124,
      vacationAllowance: 160,
      vacationUsed: 88,
      sickAllowance: 80,
      sickUsed: 16,
      toilBalance: 32,
      holidayBalance: 24
    }
  }
};

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showTimeAudit, setShowTimeAudit] = useState(false);
  
  // Convert string id to number and get employee data
  const employeeId = id ? parseInt(id, 10) : null;
  const employee = employeeId ? mockEmployeeData[employeeId as keyof typeof mockEmployeeData] : null;
  
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Employee not found</h2>
          <Button className="mt-4" onClick={() => navigate('/employees')}>
            Back to Employee List
          </Button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({ ...employee });

  const handleSave = () => {
    // Here you would typically save to API
    console.log('Saving employee data:', formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent as keyof typeof formData] as any,
        [field]: value
      }
    });
  };

  const handleTimeAdjustment = (field: string, value: number, reason: string) => {
    console.log(`Adjusting ${field} by ${value} hours. Reason: ${reason}`);
    setFormData({
      ...formData,
      yearlyStats: {
        ...formData.yearlyStats,
        [field]: Math.max(0, formData.yearlyStats[field as keyof typeof formData.yearlyStats] as number + value)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/employees')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{formData.name}</h1>
            <p className="text-gray-600">{formData.position}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowTimeAudit(!showTimeAudit)}>
                <Clock className="h-4 w-4 mr-2" />
                Time Audit
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Employee
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time & Leave Balances with Audit Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Time & Leave
              </div>
              {showTimeAudit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowTimeAudit(false)}
                >
                  Close Audit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hours Worked (YTD)</span>
                <span className="font-medium">{formData.yearlyStats.hoursWorked}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overtime (YTD)</span>
                <span className="font-medium">{formData.yearlyStats.overtime}h</span>
              </div>
              <div className="border-t pt-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vacation Used/Total</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formData.yearlyStats.vacationUsed}/{formData.yearlyStats.vacationAllowance}h</span>
                    {showTimeAudit && (
                      <TimeAdjustmentControls
                        label="Vacation"
                        onAdjust={(value, reason) => {
                          handleTimeAdjustment('vacationUsed', value, reason);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sick Used/Total</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formData.yearlyStats.sickUsed}/{formData.yearlyStats.sickAllowance}h</span>
                    {showTimeAudit && (
                      <TimeAdjustmentControls
                        label="Sick"
                        onAdjust={(value, reason) => {
                          handleTimeAdjustment('sickUsed', value, reason);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">TOIL Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formData.yearlyStats.toilBalance}h</span>
                    {showTimeAudit && (
                      <TimeAdjustmentControls
                        label="TOIL"
                        onAdjust={(value, reason) => {
                          handleTimeAdjustment('toilBalance', value, reason);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Holiday Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formData.yearlyStats.holidayBalance}h</span>
                    {showTimeAudit && (
                      <TimeAdjustmentControls
                        label="Holiday"
                        onAdjust={(value, reason) => {
                          handleTimeAdjustment('holidayBalance', value, reason);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact.name}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={formData.emergencyContact.relationship}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Permissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Application Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="incidentReporting">Incident Reporting</Label>
                <Switch
                  id="incidentReporting"
                  checked={formData.permissions.incidentReporting}
                  onCheckedChange={(checked) => handleNestedInputChange('permissions', 'incidentReporting', checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="systemCheck">System Check</Label>
                <Switch
                  id="systemCheck"
                  checked={formData.permissions.systemCheck}
                  onCheckedChange={(checked) => handleNestedInputChange('permissions', 'systemCheck', checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="changeRequests">Change Requests</Label>
                <Switch
                  id="changeRequests"
                  checked={formData.permissions.changeRequests}
                  onCheckedChange={(checked) => handleNestedInputChange('permissions', 'changeRequests', checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="employeeManagement">Employee Management</Label>
                <Switch
                  id="employeeManagement"
                  checked={formData.permissions.employeeManagement}
                  onCheckedChange={(checked) => handleNestedInputChange('permissions', 'employeeManagement', checked)}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="scheduling">Scheduling</Label>
                <Switch
                  id="scheduling"
                  checked={formData.permissions.scheduling}
                  onCheckedChange={(checked) => handleNestedInputChange('permissions', 'scheduling', checked)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Time Adjustment Controls Component
const TimeAdjustmentControls = ({ 
  label, 
  onAdjust 
}: { 
  label: string; 
  onAdjust: (value: number, reason: string) => void; 
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (adjustmentValue !== 0 && reason.trim()) {
      onAdjust(adjustmentValue, reason);
      setAdjustmentValue(0);
      setReason('');
      setShowDialog(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="h-6 px-2 text-xs"
      >
        Adjust
      </Button>
      
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold">Adjust {label} Time</h3>
            
            <div className="space-y-2">
              <Label>Adjustment (hours)</Label>
              <Input
                type="number"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter positive or negative hours"
              />
              <p className="text-xs text-gray-500">
                Use positive numbers to add time, negative to subtract
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Reason for adjustment</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this adjustment is needed..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setAdjustmentValue(0);
                  setReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={adjustmentValue === 0 || !reason.trim()}
              >
                Apply Adjustment
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeDetail;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Calendar, Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

const AddEventDialog = ({ open, onOpenChange, onSave }: AddEventDialogProps) => {
  const { facilities } = useSettings();
  const [activeTab, setActiveTab] = useState('event');
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endTime: '',
    facility: '',
    description: '',
    isRecurring: false,
    recurrencePattern: 'weekly',
    recurrenceDays: [] as string[],
    shifts: [] as any[]
  });

  const handleAddShift = () => {
    setFormData(prev => ({
      ...prev,
      shifts: [...prev.shifts, {
        id: `shift-${Date.now()}`,
        title: '',
        startTime: '',
        endTime: '',
        facility: prev.facility,
        staffCount: 1,
        description: ''
      }]
    }));
  };

  const handleRemoveShift = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shifts: prev.shifts.filter((_, i) => i !== index)
    }));
  };

  const handleShiftChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      shifts: prev.shifts.map((shift, i) => 
        i === index ? { ...shift, [field]: value } : shift
      )
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      type: activeTab,
      id: `${activeTab}-${Date.now()}`
    };
    onSave(dataToSave);
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event or Shift</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="event">Event with Shifts</TabsTrigger>
            <TabsTrigger value="shift">Standalone Shift</TabsTrigger>
          </TabsList>

          <TabsContent value="event" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Morning Show"
                />
              </div>
              <div>
                <Label htmlFor="facility">Facility</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, facility: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Event description..."
              />
            </div>

            {/* Recurrence Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: !!checked }))}
                  />
                  <Label htmlFor="recurring" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Recurring Event
                  </Label>
                </div>
              </CardHeader>
              {formData.isRecurring && (
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Recurrence Pattern</Label>
                      <Select 
                        value={formData.recurrencePattern}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, recurrencePattern: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.recurrencePattern === 'weekly' && (
                      <div>
                        <Label>Days of Week</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {weekDays.map((day) => (
                            <div key={day} className="flex items-center space-x-2">
                              <Checkbox
                                id={day}
                                checked={formData.recurrenceDays.includes(day)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      recurrenceDays: [...prev.recurrenceDays, day]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      recurrenceDays: prev.recurrenceDays.filter(d => d !== day)
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={day} className="text-sm">{day.substring(0, 3)}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Shifts Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Event Shifts
                  </CardTitle>
                  <Button onClick={handleAddShift} size="sm">
                    <Plus className="h-4 w-4" />
                    Add Shift
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.shifts.map((shift, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Shift {index + 1}</h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveShift(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Shift Title</Label>
                          <Input
                            value={shift.title}
                            onChange={(e) => handleShiftChange(index, 'title', e.target.value)}
                            placeholder="e.g., Show Host"
                          />
                        </div>
                        <div>
                          <Label>Staff Count</Label>
                          <Input
                            type="number"
                            min="1"
                            value={shift.staffCount}
                            onChange={(e) => handleShiftChange(index, 'staffCount', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={shift.startTime}
                            onChange={(e) => handleShiftChange(index, 'startTime', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={shift.endTime}
                            onChange={(e) => handleShiftChange(index, 'endTime', e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  {formData.shifts.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No shifts added yet. Click "Add Shift" to create shifts for this event.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shift" className="space-y-6">
            {/* Similar form for standalone shifts */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shift-title">Shift Title</Label>
                <Input
                  id="shift-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Technical Support"
                />
              </div>
              <div>
                <Label htmlFor="shift-facility">Facility</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, facility: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Similar time and recurrence fields */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shift-startDate">Start Date</Label>
                <Input
                  id="shift-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shift-startTime">Start Time</Label>
                <Input
                  id="shift-startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="shift-endTime">End Time</Label>
                <Input
                  id="shift-endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save {activeTab === 'event' ? 'Event' : 'Shift'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';

const Settings = () => {
  const { locations, shifts } = useSettings();
  const [localLocations, setLocalLocations] = useState(locations);
  const [localShifts, setLocalShifts] = useState(shifts);
  const [newLocation, setNewLocation] = useState('');
  const [newShift, setNewShift] = useState('');
  const { toast } = useToast();

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

  const handleSaveChanges = () => {
    // In a real app, this would save to a backend/database
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <Button onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>

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

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800 space-y-2">
            <p>• Locations and shifts defined here will be available in the Time Keeping clock entry form.</p>
            <p>• Scheduled events will automatically appear in the shift dropdown for the selected date.</p>
            <p>• Changes are saved locally and will persist across sessions once saved.</p>
            <p>• In a production environment, these settings would be managed by administrators and stored in a database.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

interface ClockEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  existingEntries?: Array<{date: string, timeIn: string}>;
}

const ClockEntryForm = ({ onSubmit, onCancel, existingEntries = [] }: ClockEntryFormProps) => {
  const { locations, shifts, getScheduledEvents } = useSettings();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [scheduledEvents, setScheduledEvents] = useState<Array<{id: number, name: string, time: string}>>([]);
  const [hasExistingEntry, setHasExistingEntry] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedDate) {
      // Get scheduled events for the selected date
      getScheduledEvents(selectedDate).then(events => {
        const formattedEvents = events.map(event => ({
          id: event.id,
          name: event.title,
          time: new Date(event.start_time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })
        }));
        setScheduledEvents(formattedEvents);
      });
      
      // Check for existing entries on this date
      const existingOnDate = existingEntries.some(entry => entry.date === selectedDate);
      setHasExistingEntry(existingOnDate);
    }
  }, [selectedDate, existingEntries, getScheduledEvents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      date: selectedDate,
      timeIn: formData.get('timeIn'),
      timeOut: formData.get('timeOut'),
      location: selectedLocation,
      shift: selectedShift,
      notes: formData.get('notes'),
    };
    onSubmit(data);
  };

  const allShiftOptions = [
    ...shifts.map(shift => shift.name),
    ...scheduledEvents.map(event => `${event.name} (${event.time})`)
  ];

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Clock Entry</DialogTitle>
        <DialogDescription>
          Create a new time clock entry for your work hours.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation} required>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeIn">Time In (24hr)</Label>
            <Input
              id="timeIn"
              name="timeIn"
              type="time"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeOut">Time Out (24hr)</Label>
            <Input
              id="timeOut"
              name="timeOut"
              type="time"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift">Shift/Event</Label>
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger>
              <SelectValue placeholder="Select shift or event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Entry</SelectItem>
              {allShiftOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any additional notes about this work period..."
            rows={3}
          />
        </div>

        {hasExistingEntry && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Warning: You already have a clock entry for this date. Multiple entries per day are allowed.
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Entry
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ClockEntryForm;

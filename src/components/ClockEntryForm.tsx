
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ClockEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ClockEntryForm = ({ onSubmit, onCancel }: ClockEntryFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      date: formData.get('date'),
      timeIn: formData.get('timeIn'),
      timeOut: formData.get('timeOut'),
      location: formData.get('location'),
      shift: formData.get('shift'),
      notes: formData.get('notes'),
    };
    onSubmit(data);
  };

  const today = new Date().toISOString().split('T')[0];

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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Studio A"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeIn">Time In</Label>
            <Input
              id="timeIn"
              name="timeIn"
              type="time"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeOut">Time Out</Label>
            <Input
              id="timeOut"
              name="timeOut"
              type="time"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shift">Shift/Event</Label>
          <Input
            id="shift"
            name="shift"
            placeholder="Morning Show, Evening News, etc."
          />
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

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock } from "lucide-react";
import React, { useState } from "react";

interface ClockEntry {
  date: string;
  timeIn: string;
  timeOut: string;
  location: string;
  shift: string;
  lunchTaken: number;
  notes: string;
  hours: number;
}

interface EnhancedClockEntryFormProps {
  onSubmit: (data: ClockEntry) => void;
  onCancel: () => void;
  existingEntries: ClockEntry[];
}

const EnhancedClockEntryForm = ({
  onSubmit,
  onCancel,
  existingEntries,
}: EnhancedClockEntryFormProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    timeIn: "",
    timeOut: "",
    location: "",
    shift: "",
    lunchTaken: "0.5",
    notes: "",
  });

  const [isClockIn, setIsClockIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let calculatedHours = 0;
    if (formData.timeIn && formData.timeOut) {
      const [inHour, inMin] = formData.timeIn.split(":").map(Number);
      const [outHour, outMin] = formData.timeOut.split(":").map(Number);
      const timeInMinutes = inHour * 60 + inMin;
      const timeOutMinutes = outHour * 60 + outMin;
      const totalMinutes = timeOutMinutes - timeInMinutes;
      calculatedHours =
        Math.round((totalMinutes / 60 - parseFloat(formData.lunchTaken)) * 10) /
        10;
    }

    onSubmit({
      ...formData,
      hours: calculatedHours,
      lunchTaken: parseFloat(formData.lunchTaken),
    });
  };

  const handleClockNow = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);

    if (isClockIn) {
      setFormData((prev) => ({ ...prev, timeIn: timeString }));
    } else {
      setFormData((prev) => ({ ...prev, timeOut: timeString }));
    }
  };

  // Check if there's an existing entry for today that's only clocked in
  const todayEntry = existingEntries.find(
    (entry) => entry.date === formData.date && entry.timeOut === "--:--",
  );

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Clock Entry
        </DialogTitle>
        <DialogDescription>
          Record your work hours for the day
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timeIn">Time In</Label>
            <div className="flex gap-2">
              <Input
                id="timeIn"
                type="time"
                value={formData.timeIn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, timeIn: e.target.value }))
                }
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsClockIn(true);
                  handleClockNow();
                }}
              >
                Now
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="timeOut">Time Out</Label>
            <div className="flex gap-2">
              <Input
                id="timeOut"
                type="time"
                value={formData.timeOut}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, timeOut: e.target.value }))
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsClockIn(false);
                  handleClockNow();
                }}
              >
                Now
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="lunchTaken">Lunch Break (Hours)</Label>
          <Select
            value={formData.lunchTaken}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, lunchTaken: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select lunch duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No lunch break</SelectItem>
              <SelectItem value="0.5">30 minutes</SelectItem>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="1.5">1.5 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Select
            value={formData.location}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Studio A">Studio A</SelectItem>
              <SelectItem value="Studio B">Studio B</SelectItem>
              <SelectItem value="Studio C">Studio C</SelectItem>
              <SelectItem value="Control Room">Control Room</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="shift">Shift/Show</Label>
          <Input
            id="shift"
            placeholder="e.g., Morning Show, Evening News"
            value={formData.shift}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shift: e.target.value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional notes about this shift..."
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={2}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Submit Entry
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EnhancedClockEntryForm;

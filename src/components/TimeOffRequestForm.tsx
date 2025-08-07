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
import { Calendar } from "lucide-react";
import React, { useCallback, useState } from "react";

interface TimeOffRequestData {
  type: string;
  startDate: string;
  endDate: string;
  hours: number;
  reason: string;
  includeLunch: boolean;
}

interface TimeOffRequestFormProps {
  onSubmit: (data: TimeOffRequestData) => void;
  onCancel: () => void;
}

const TimeOffRequestForm = ({
  onSubmit,
  onCancel,
}: TimeOffRequestFormProps) => {
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    hours: "",
    reason: "",
    includeLunch: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate hours based on type and dates
    let calculatedHours = parseFloat(formData.hours) || 0;

    // If it's a full day and includeLunch is true, subtract 0.5 hours
    if (formData.includeLunch && calculatedHours >= 7.5) {
      calculatedHours = Math.max(7.5, calculatedHours - 0.5);
    }

    onSubmit({
      ...formData,
      hours: calculatedHours,
    });
  };

  const calculateDays = useCallback(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Calculate hours (7.5 per day if lunch is included, 8 if not)
      const hoursPerDay = formData.includeLunch ? 7.5 : 8;
      const totalHours = diffDays * hoursPerDay;

      setFormData((prev) => ({ ...prev, hours: totalHours.toString() }));
    }
  }, [formData.startDate, formData.endDate, formData.includeLunch]);

  React.useEffect(() => {
    calculateDays();
  }, [calculateDays]);

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Time Off Request
        </DialogTitle>
        <DialogDescription>
          Submit a request for time off. Your manager will review and approve.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Type of Leave</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal Time Off</SelectItem>
              <SelectItem value="toil">Time Off In Lieu (TOIL)</SelectItem>
              <SelectItem value="bank-holiday">Bank Holiday</SelectItem>
              <SelectItem value="sick">Sick Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {formData.type !== "sick" && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeLunch"
              checked={formData.includeLunch}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  includeLunch: e.target.checked,
                }))
              }
              className="rounded"
            />
            <Label htmlFor="includeLunch" className="text-sm">
              Include lunch break (deduct 0.5 hours per day)
            </Label>
          </div>
        )}

        <div>
          <Label htmlFor="hours">Total Hours</Label>
          <Input
            id="hours"
            type="number"
            step="0.5"
            value={formData.hours}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hours: e.target.value }))
            }
            required
          />
          {formData.type === "sick" && (
            <p className="text-xs text-gray-600 mt-1">
              Sick leave does not count against your holiday allowance
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="reason">Reason (Optional)</Label>
          <Textarea
            id="reason"
            placeholder="Provide additional details if needed..."
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Submit Request
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

export default TimeOffRequestForm;

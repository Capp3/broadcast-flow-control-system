import AddEventDialog from "@/components/scheduling/AddEventDialog";
import EndpointConfigDialog from "@/components/scheduling/EndpointConfigDialog";
import ImportExportDialog from "@/components/scheduling/ImportExportDialog";
import RotaView from "@/components/scheduling/RotaView";
import ScheduleCalendar from "@/components/scheduling/ScheduleCalendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import {
  Calendar,
  Clock,
  Download,
  Plus,
  RefreshCw,
  Settings,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  type: "event" | "shift";
  isRecurring: boolean;
  recurrencePattern?: string;
  recurrenceDays?: string[];
  shifts?: Shift[];
  color: string;
}

interface Shift {
  id: string;
  eventId?: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  assignedStaff?: string[];
  isRecurring: boolean;
  color: string;
}

const Scheduling = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"schedule" | "rota">("schedule");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportExportDialog, setShowImportExportDialog] = useState(false);
  const [showEndpointDialog, setShowEndpointDialog] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });

  // Mock data - in real app this would come from employee management
  const [employees] = useState([
    {
      id: "1",
      name: "John Operator",
      position: "Senior Broadcast Operator",
      department: "Operations",
      status: "Active",
    },
    {
      id: "2",
      name: "Sarah Engineer",
      position: "Broadcast Engineer",
      department: "Engineering",
      status: "Active",
    },
    {
      id: "3",
      name: "Mike Manager",
      position: "Operations Manager",
      department: "Management",
      status: "Active",
    },
    {
      id: "4",
      name: "Lisa Technician",
      position: "Maintenance Technician",
      department: "Engineering",
      status: "Active",
    },
  ]);

  // Mock shifts data
  const [shifts, setShifts] = useState([
    {
      id: "s1",
      title: "Morning Show Host",
      startTime: "07:30",
      endTime: "11:30",
      facility: "Studio A",
      assignedStaff: ["1"],
      date: new Date(2024, 11, 16), // Monday
    },
    {
      id: "s2",
      title: "Evening News Anchor",
      startTime: "17:30",
      endTime: "19:30",
      facility: "Studio B",
      assignedStaff: ["2"],
      date: new Date(2024, 11, 16), // Monday
    },
    {
      id: "s3",
      title: "Technical Support",
      startTime: "09:00",
      endTime: "17:00",
      facility: "Control Room",
      assignedStaff: [],
      date: new Date(2024, 11, 17), // Tuesday
    },
    {
      id: "s4",
      title: "Weekend Show Host",
      startTime: "08:00",
      endTime: "12:00",
      facility: "Studio A",
      assignedStaff: [],
      date: new Date(2024, 11, 18), // Wednesday
    },
  ]);

  // Mock time off requests
  const [timeOffRequests] = useState([
    {
      employeeId: "3",
      date: new Date(2024, 11, 17), // Tuesday
      type: "vacation" as const,
      status: "approved" as const,
    },
  ]);

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  const handleEventSave = (data: any) => {
    console.log("Saving event/shift:", data);
    setShowAddDialog(false);
  };

  const handleEventEdit = (event: Event) => {
    console.log("Editing event:", event);
    setShowAddDialog(true);
  };

  const handleShiftEdit = (shift: Shift) => {
    console.log("Editing shift:", shift);
    setShowAddDialog(true);
  };

  const handleShiftAssignment = (shiftId: string, employeeId: string) => {
    setShifts((prev) =>
      prev.map((shift) => {
        if (shift.id === shiftId) {
          const updatedStaff = shift.assignedStaff || [];
          if (!updatedStaff.includes(employeeId)) {
            return { ...shift, assignedStaff: [...updatedStaff, employeeId] };
          }
        }
        return shift;
      }),
    );
    console.log("Assigned employee", employeeId, "to shift", shiftId);
  };

  const handleShiftUnassignment = (shiftId: string, employeeId: string) => {
    setShifts((prev) =>
      prev.map((shift) => {
        if (shift.id === shiftId) {
          return {
            ...shift,
            assignedStaff: (shift.assignedStaff || []).filter(
              (id) => id !== employeeId,
            ),
          };
        }
        return shift;
      }),
    );
    console.log("Unassigned employee", employeeId, "from shift", shiftId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scheduling Management</h1>
          <p className="text-gray-600">
            Manage events, shifts, and staff assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Week of {format(weekStart, "MMM d, yyyy")}
          </Badge>
        </div>
      </div>

      {/* Mode Selector and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs
              value={viewMode}
              onValueChange={(value) =>
                setViewMode(value as "schedule" | "rota")
              }
            >
              <TabsList>
                <TabsTrigger
                  value="schedule"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule View
                </TabsTrigger>
                <TabsTrigger value="rota" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Staff Rota
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreviousWeek}>
                Previous Week
              </Button>
              <Button variant="outline" onClick={handleToday}>
                Today
              </Button>
              <Button variant="outline" onClick={handleNextWeek}>
                Next Week
              </Button>

              <div className="h-6 w-px bg-gray-300 mx-2" />

              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event/Shift
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowImportExportDialog(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import/Export
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowEndpointDialog(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                API Config
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Views */}
      <Tabs value={viewMode} className="space-y-6">
        <TabsContent value="schedule">
          <ScheduleCalendar
            currentWeek={currentWeek}
            mode={viewMode}
            onEventEdit={handleEventEdit}
            onShiftEdit={handleShiftEdit}
          />
        </TabsContent>

        <TabsContent value="rota">
          <RotaView
            currentWeek={currentWeek}
            employees={employees}
            shifts={shifts}
            timeOffRequests={timeOffRequests}
            onShiftAssignment={handleShiftAssignment}
            onShiftUnassignment={handleShiftUnassignment}
          />
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Events This Week</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Shifts Scheduled</p>
                <p className="text-2xl font-bold">{shifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Assigned Shifts</p>
                <p className="text-2xl font-bold">
                  {
                    shifts.filter(
                      (s) => s.assignedStaff && s.assignedStaff.length > 0,
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Time Off Requests</p>
                <p className="text-2xl font-bold">{timeOffRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddEventDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleEventSave}
      />

      <ImportExportDialog
        open={showImportExportDialog}
        onOpenChange={setShowImportExportDialog}
      />

      <EndpointConfigDialog
        open={showEndpointDialog}
        onOpenChange={setShowEndpointDialog}
      />
    </div>
  );
};

export default Scheduling;

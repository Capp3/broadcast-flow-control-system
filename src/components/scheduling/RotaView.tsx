
import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertTriangle, Calendar } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: string;
}

interface Shift {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  assignedStaff?: string[];
  requiredRole?: string;
  date: Date;
}

interface TimeOffRequest {
  employeeId: string;
  date: Date;
  type: 'vacation' | 'sick' | 'personal';
  status: 'approved';
}

interface RotaViewProps {
  currentWeek: Date;
  employees: Employee[];
  shifts: Shift[];
  timeOffRequests: TimeOffRequest[];
  onShiftAssignment: (shiftId: string, employeeId: string) => void;
  onShiftUnassignment: (shiftId: string, employeeId: string) => void;
}

const RotaView = ({ 
  currentWeek, 
  employees, 
  shifts, 
  timeOffRequests,
  onShiftAssignment,
  onShiftUnassignment 
}: RotaViewProps) => {
  const [draggedEmployee, setDraggedEmployee] = useState<string | null>(null);
  const [draggedFromShift, setDraggedFromShift] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getShiftsForDay = (date: Date) => {
    return shifts.filter(shift => 
      shift.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getEmployeeTimeOff = (employeeId: string, date: Date) => {
    return timeOffRequests.find(request => 
      request.employeeId === employeeId && 
      request.date.toDateString() === date.toDateString() &&
      request.status === 'approved'
    );
  };

  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const hasConflict = (employeeId: string, targetShift: Shift) => {
    const employeeShifts = shifts.filter(shift => 
      shift.assignedStaff?.includes(employeeId) &&
      shift.date.toDateString() === targetShift.date.toDateString() &&
      shift.id !== targetShift.id
    );

    return employeeShifts.some(shift => {
      const shiftStart = parseInt(shift.startTime.replace(':', ''));
      const shiftEnd = parseInt(shift.endTime.replace(':', ''));
      const targetStart = parseInt(targetShift.startTime.replace(':', ''));
      const targetEnd = parseInt(targetShift.endTime.replace(':', ''));
      
      return (targetStart < shiftEnd && targetEnd > shiftStart);
    });
  };

  const canAssignEmployee = (employeeId: string, shift: Shift) => {
    const timeOff = getEmployeeTimeOff(employeeId, shift.date);
    return !timeOff; // Allow conflicts but highlight them
  };

  const handleDragStart = (e: React.DragEvent, employeeId: string, fromShiftId?: string) => {
    setDraggedEmployee(employeeId);
    setDraggedFromShift(fromShiftId || null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, shiftId: string) => {
    e.preventDefault();
    if (draggedEmployee && canAssignEmployee(draggedEmployee, shifts.find(s => s.id === shiftId)!)) {
      setDropTarget(shiftId);
      e.dataTransfer.dropEffect = 'move';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, shiftId: string) => {
    e.preventDefault();
    if (draggedEmployee) {
      if (draggedFromShift && draggedFromShift !== shiftId) {
        onShiftUnassignment(draggedFromShift, draggedEmployee);
      }
      onShiftAssignment(shiftId, draggedEmployee);
    }
    setDraggedEmployee(null);
    setDraggedFromShift(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedEmployee(null);
    setDraggedFromShift(null);
    setDropTarget(null);
  };

  return (
    <div className="grid grid-cols-4 gap-6 h-full">
      {/* Employee Panel */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Available Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {employees.filter(emp => emp.status === 'Active').map(employee => (
            <div
              key={employee.id}
              draggable
              onDragStart={(e) => handleDragStart(e, employee.id)}
              onDragEnd={handleDragEnd}
              className="p-3 bg-gray-50 rounded-lg border cursor-move hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-sm">{employee.name}</div>
              <div className="text-xs text-gray-600">{employee.position}</div>
              <div className="text-xs text-gray-500">{employee.department}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Rota Grid */}
      <div className="col-span-3 space-y-4">
        {weekDays.map((day, dayIndex) => {
          const dayShifts = getShiftsForDay(day);
          
          return (
            <Card key={dayIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{format(day, 'EEEE, MMM d')}</span>
                  <Badge variant="outline" className="text-xs">
                    {dayShifts.length} shifts
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dayShifts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No shifts scheduled
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dayShifts.map(shift => (
                      <div
                        key={shift.id}
                        onDragOver={(e) => handleDragOver(e, shift.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, shift.id)}
                        className={`p-3 border rounded-lg transition-all ${
                          dropTarget === shift.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">{shift.title}</span>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          {shift.startTime} - {shift.endTime} • {shift.facility}
                        </div>

                        {/* Assigned Staff */}
                        <div className="space-y-1">
                          {shift.assignedStaff?.map(staffId => {
                            const employee = getEmployeeById(staffId);
                            const timeOff = getEmployeeTimeOff(staffId, day);
                            const conflict = hasConflict(staffId, shift);
                            
                            return (
                              <div
                                key={staffId}
                                draggable
                                onDragStart={(e) => handleDragStart(e, staffId, shift.id)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-2 p-2 rounded text-xs cursor-move ${
                                  timeOff 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                    : conflict
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-green-100 text-green-800 border border-green-200'
                                }`}
                              >
                                <User className="h-3 w-3" />
                                <span className="flex-1">{employee?.name}</span>
                                {timeOff && <Calendar className="h-3 w-3" />}
                                {conflict && <AlertTriangle className="h-3 w-3" />}
                              </div>
                            );
                          })}
                          
                          {(!shift.assignedStaff || shift.assignedStaff.length === 0) && (
                            <div className="text-xs text-gray-400 italic p-2 border-2 border-dashed border-gray-200 rounded">
                              Drop staff here to assign
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RotaView;

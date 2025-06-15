
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Download, 
  FileText, 
  Clock,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';

const RotaReport = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isGenerating, setIsGenerating] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Mock crew data - in real app this would come from scheduling system
  const crewMembers = [
    { id: '1', name: 'John Operator', position: 'Senior Operator' },
    { id: '2', name: 'Sarah Engineer', position: 'Broadcast Engineer' },
    { id: '3', name: 'Mike Manager', position: 'Operations Manager' },
    { id: '4', name: 'Lisa Tech', position: 'Technician' },
    { id: '5', name: 'Tom Host', position: 'Show Host' },
    { id: '6', name: 'Amy Producer', position: 'Producer' }
  ];

  // Mock schedule data
  const getShiftsForDay = (date: Date) => {
    const dayIndex = date.getDay();
    const shifts = [];

    // Morning shifts (6:00 - 14:00)
    if (dayIndex >= 1 && dayIndex <= 5) {
      shifts.push({
        time: '06:00 - 14:00',
        shift: 'Morning Show',
        location: 'Studio A',
        crew: ['John Operator', 'Tom Host']
      });
    }

    // Afternoon shifts (14:00 - 22:00)
    if (dayIndex >= 1 && dayIndex <= 6) {
      shifts.push({
        time: '14:00 - 22:00',
        shift: 'Afternoon Programming',
        location: 'Studio B',
        crew: ['Sarah Engineer', 'Amy Producer']
      });
    }

    // Evening shifts (18:00 - 02:00)
    if (dayIndex === 0 || dayIndex >= 5) {
      shifts.push({
        time: '18:00 - 02:00',
        shift: 'Weekend Shows',
        location: 'Studio A',
        crew: ['Mike Manager', 'Lisa Tech']
      });
    }

    // Night maintenance (22:00 - 06:00)
    if (dayIndex === 2 || dayIndex === 4) {
      shifts.push({
        time: '22:00 - 06:00',
        shift: 'Maintenance',
        location: 'Technical Areas',
        crew: ['Lisa Tech']
      });
    }

    return shifts;
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    console.log('Generating PDF rota for week:', format(weekStart, 'yyyy-MM-dd'));
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, this would generate an actual PDF
    const filename = `crew-rota-${format(weekStart, 'yyyy-MM-dd')}.pdf`;
    console.log('PDF generated:', filename);
    
    setIsGenerating(false);
    
    // Show success message
    alert(`Crew rota PDF generated: ${filename}\n\nIn a real implementation, this would download the PDF file.`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Crew Rota
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Badge variant="outline" className="px-3">
              Week of {format(weekStart, 'MMM d, yyyy')}
            </Badge>
            
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="h-6 w-px bg-gray-300 mx-2" />
            
            <Button onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Rota Grid */}
        <div className="grid grid-cols-8 gap-2 mb-6">
          {/* Header */}
          <div className="font-medium text-center p-3 bg-gray-50 rounded">Time</div>
          {weekDays.map((day, index) => (
            <div key={index} className="font-medium text-center p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}
          
          {/* Shifts for each day */}
          {weekDays.map((day, dayIndex) => {
            const shifts = getShiftsForDay(day);
            return (
              <React.Fragment key={dayIndex}>
                <div className="p-3 bg-gray-50 rounded text-sm font-medium text-gray-600">
                  Shifts
                </div>
                <div className="space-y-2">
                  {shifts.length === 0 ? (
                    <div className="text-xs text-gray-400 italic p-2">No shifts</div>
                  ) : (
                    shifts.map((shift, shiftIndex) => (
                      <div key={shiftIndex} className="border rounded p-2 bg-white">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span className="text-xs font-medium">{shift.time}</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{shift.shift}</div>
                        <div className="text-xs text-gray-500 mb-2">{shift.location}</div>
                        {shift.crew.map((member, memberIndex) => (
                          <div key={memberIndex} className="flex items-center gap-1 mb-1">
                            <User className="h-3 w-3 text-green-500" />
                            <span className="text-xs">{member}</span>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Crew</p>
                  <p className="text-2xl font-bold">{crewMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Shifts</p>
                  <p className="text-2xl font-bold">
                    {weekDays.reduce((total, day) => total + getShiftsForDay(day).length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Days</p>
                  <p className="text-2xl font-bold">
                    {weekDays.filter(day => getShiftsForDay(day).length > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Coverage</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default RotaReport;

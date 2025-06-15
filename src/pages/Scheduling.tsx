
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, Settings, Upload, Download, RefreshCw } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import ScheduleCalendar from '@/components/scheduling/ScheduleCalendar';
import AddEventDialog from '@/components/scheduling/AddEventDialog';
import ImportExportDialog from '@/components/scheduling/ImportExportDialog';
import EndpointConfigDialog from '@/components/scheduling/EndpointConfigDialog';

const Scheduling = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'schedule' | 'rota'>('schedule');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportExportDialog, setShowImportExportDialog] = useState(false);
  const [showEndpointDialog, setShowEndpointDialog] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  const handleEventSave = (data: any) => {
    console.log('Saving event/shift:', data);
    setShowAddDialog(false);
  };

  const handleEventEdit = (event: any) => {
    console.log('Editing event:', event);
    setShowAddDialog(true);
  };

  const handleShiftEdit = (shift: any) => {
    console.log('Editing shift:', shift);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scheduling Management</h1>
          <p className="text-gray-600">Manage events, shifts, and staff assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Week of {format(weekStart, 'MMM d, yyyy')}
          </Badge>
        </div>
      </div>

      {/* Mode Selector and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'schedule' | 'rota')}>
              <TabsList>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
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
              
              <Button variant="outline" onClick={() => setShowImportExportDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import/Export
              </Button>
              
              <Button variant="outline" onClick={() => setShowEndpointDialog(true)}>
                <Settings className="h-4 w-4 mr-2" />
                API Config
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar View */}
      <ScheduleCalendar
        currentWeek={currentWeek}
        mode={viewMode}
        onEventEdit={handleEventEdit}
        onShiftEdit={handleShiftEdit}
      />

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
                <p className="text-2xl font-bold">28</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Recurring Items</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Last Sync</p>
                <p className="text-sm font-medium">2 hours ago</p>
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

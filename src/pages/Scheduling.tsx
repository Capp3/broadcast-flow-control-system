
import React, { useState } from 'react';
import { Calendar, Plus, Upload, Download, Settings, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import ScheduleCalendar from '@/components/scheduling/ScheduleCalendar';
import AddEventDialog from '@/components/scheduling/AddEventDialog';
import ImportExportDialog from '@/components/scheduling/ImportExportDialog';
import EndpointConfigDialog from '@/components/scheduling/EndpointConfigDialog';

const Scheduling = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showEndpointConfig, setShowEndpointConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Management Scheduling - Week of {format(weekStart, 'MMMM d, yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEndpointConfig(true)}
              >
                <Settings className="h-4 w-4" />
                API Config
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowImportExport(true)}
              >
                <Upload className="h-4 w-4" />
                Import/Export
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowAddEvent(true)}
              >
                <Plus className="h-4 w-4" />
                Add Event/Shift
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateWeek('prev')}>
              ← Previous Week
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentWeek(new Date())}
              >
                Current Week
              </Button>
            </div>
            <Button variant="outline" onClick={() => navigateWeek('next')}>
              Next Week →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Schedule Management</TabsTrigger>
          <TabsTrigger value="rota">Staff Rota</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <ScheduleCalendar 
            currentWeek={currentWeek}
            mode="schedule"
            onEventEdit={(event) => console.log('Edit event:', event)}
            onShiftEdit={(shift) => console.log('Edit shift:', shift)}
          />
        </TabsContent>
        
        <TabsContent value="rota" className="space-y-4">
          <ScheduleCalendar 
            currentWeek={currentWeek}
            mode="rota"
            onEventEdit={(event) => console.log('Edit event:', event)}
            onShiftEdit={(shift) => console.log('Edit shift:', shift)}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddEventDialog 
        open={showAddEvent}
        onOpenChange={setShowAddEvent}
        onSave={(data) => {
          console.log('Save event/shift:', data);
          setShowAddEvent(false);
        }}
      />
      
      <ImportExportDialog 
        open={showImportExport}
        onOpenChange={setShowImportExport}
      />
      
      <EndpointConfigDialog 
        open={showEndpointConfig}
        onOpenChange={setShowEndpointConfig}
      />
    </div>
  );
};

export default Scheduling;

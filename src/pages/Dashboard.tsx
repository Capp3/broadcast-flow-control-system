
import React from 'react';
import { Calendar, Clock, Users, Settings, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const currentWeek = [
    { date: '2025-06-14', day: 'Monday', isToday: true, events: 3 },
    { date: '2025-06-15', day: 'Tuesday', isToday: false, events: 2 },
    { date: '2025-06-16', day: 'Wednesday', isToday: false, events: 1 },
    { date: '2025-06-17', day: 'Thursday', isToday: false, events: 4 },
    { date: '2025-06-18', day: 'Friday', isToday: false, events: 2 },
    { date: '2025-06-19', day: 'Saturday', isToday: false, events: 0 },
    { date: '2025-06-20', day: 'Sunday', isToday: false, events: 1 },
  ];

  const quickActions = [
    { title: 'Time Clock', icon: Clock, description: 'Clock in/out', href: '/timeclock' },
    { title: 'Schedule', icon: Calendar, description: 'View schedule', href: '/schedule' },
    { title: 'Report Incident', icon: AlertTriangle, description: 'Report an issue', href: '/incident-report' },
    { title: 'System Check', icon: Settings, description: 'Daily checks', href: '/system-check' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Broadcast Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, John Operator</span>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Current Week Calendar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Week
            </CardTitle>
            <CardDescription>Week of June 14, 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {currentWeek.map((day) => (
                <div
                  key={day.date}
                  className={`p-4 rounded-lg border text-center ${
                    day.isToday
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm">{day.day}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(day.date).getDate()}
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {day.events} events
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="radio"
                id="show-employees"
                name="calendar-view"
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="show-employees" className="text-sm text-gray-700">
                Show employees scheduled for each day
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {quickActions.map((action) => (
            <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <action.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Clocked in</div>
                    <div className="text-sm text-gray-600">08:00 AM - Studio A</div>
                  </div>
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">System check completed</div>
                    <div className="text-sm text-gray-600">All systems operational</div>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="font-medium text-orange-800">Shift Alert</div>
                  <div className="text-sm text-orange-700">
                    Studio B shift starting in 2 hours - No operator assigned
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">Schedule Update</div>
                  <div className="text-sm text-blue-700">
                    New event added for tomorrow - Morning Show Extended
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

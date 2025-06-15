
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/hooks/use-toast';
import DepartmentChecklist from '@/components/DepartmentChecklist';

interface CheckItem {
  id: string;
  name: string;
  checked: boolean;
  notes?: string;
}

interface Department {
  id: string;
  name: string;
  items: CheckItem[];
}

const SystemCheck = () => {
  const { facilities } = useSettings();
  const { toast } = useToast();
  
  const [operator, setOperator] = useState('');
  const [facility, setFacility] = useState('');
  const [checkDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'video',
      name: 'Video',
      items: [
        { id: 'switcher', name: 'Switcher', checked: false },
        { id: 'routing', name: 'Routing', checked: false },
        { id: 'streaming', name: 'Streaming', checked: false },
        { id: 'cameras', name: 'Cameras', checked: false },
        { id: 'monitors', name: 'Monitors', checked: false },
        { id: 'recording', name: 'Recording Equipment', checked: false }
      ]
    },
    {
      id: 'audio',
      name: 'Audio',
      items: [
        { id: 'microphones', name: 'Microphones', checked: false },
        { id: 'mixer', name: 'Mixer', checked: false },
        { id: 'hearing-assist', name: 'Hearing Assist', checked: false },
        { id: 'speakers', name: 'Speakers', checked: false },
        { id: 'audio-routing', name: 'Audio Routing', checked: false },
        { id: 'headphones', name: 'Headphones', checked: false }
      ]
    },
    {
      id: 'annunciator',
      name: 'Annunciator',
      items: [
        { id: 'signage', name: 'Signage', checked: false },
        { id: 'control', name: 'Control', checked: false },
        { id: 'strap-line', name: 'Strap Line', checked: false },
        { id: 'emergency-alerts', name: 'Emergency Alerts', checked: false },
        { id: 'display-boards', name: 'Display Boards', checked: false }
      ]
    }
  ]);

  const [generalNotes, setGeneralNotes] = useState('');

  const updateDepartmentItem = (deptId: string, itemId: string, checked: boolean, notes?: string) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === deptId 
        ? {
            ...dept,
            items: dept.items.map(item => 
              item.id === itemId 
                ? { ...item, checked, notes }
                : item
            )
          }
        : dept
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!operator || !facility) {
      toast({
        title: "Missing Information",
        description: "Please select operator and facility before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Calculate completion stats
    const totalItems = departments.reduce((sum, dept) => sum + dept.items.length, 0);
    const completedItems = departments.reduce((sum, dept) => 
      sum + dept.items.filter(item => item.checked).length, 0
    );

    console.log('System Check Submitted:', {
      operator,
      facility,
      checkDate,
      departments,
      generalNotes,
      completion: `${completedItems}/${totalItems}`
    });

    toast({
      title: "System Check Completed",
      description: `${completedItems}/${totalItems} items checked. Report saved successfully.`,
    });
  };

  const getCompletionStats = () => {
    const totalItems = departments.reduce((sum, dept) => sum + dept.items.length, 0);
    const completedItems = departments.reduce((sum, dept) => 
      sum + dept.items.filter(item => item.checked).length, 0
    );
    return { total: totalItems, completed: completedItems };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily System Check</h1>
          <p className="text-gray-600 mt-1">
            Technical systems verification - {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>{stats.completed}/{stats.total} Complete</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <Card>
          <CardHeader>
            <CardTitle>Check Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Input
                id="operator"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="Enter operator name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facility">Facility</Label>
              <Select value={facility} onValueChange={setFacility} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((fac) => (
                    <SelectItem key={fac} value={fac}>{fac}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={checkDate}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Department Checklists */}
        <div className="grid gap-6">
          {departments.map((department) => (
            <DepartmentChecklist
              key={department.id}
              department={department}
              onItemUpdate={updateDepartmentItem}
            />
          ))}
        </div>

        {/* General Notes */}
        <Card>
          <CardHeader>
            <CardTitle>General Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any additional observations, issues, or notes..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Complete System Check
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemCheck;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Monitor, Volume2, MessageSquare } from 'lucide-react';

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

interface DepartmentChecklistProps {
  department: Department;
  onItemUpdate: (deptId: string, itemId: string, checked: boolean, notes?: string) => void;
}

const DepartmentChecklist = ({ department, onItemUpdate }: DepartmentChecklistProps) => {
  const completedItems = department.items.filter(item => item.checked).length;
  const totalItems = department.items.length;
  const isComplete = completedItems === totalItems;

  const getDepartmentIcon = (deptId: string) => {
    switch (deptId) {
      case 'video':
        return <Monitor className="h-5 w-5" />;
      case 'audio':
        return <Volume2 className="h-5 w-5" />;
      case 'annunciator':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    onItemUpdate(department.id, itemId, checked);
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    const item = department.items.find(i => i.id === itemId);
    if (item) {
      onItemUpdate(department.id, itemId, item.checked, notes);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getDepartmentIcon(department.id)}
            <span>{department.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {isComplete ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Complete</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span>{completedItems}/{totalItems}</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {department.items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${department.id}-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
                />
                <Label 
                  htmlFor={`${department.id}-${item.id}`}
                  className={`text-sm font-medium ${item.checked ? 'line-through text-gray-500' : ''}`}
                >
                  {item.name}
                </Label>
              </div>
              <Input
                placeholder="Notes (optional)"
                value={item.notes || ''}
                onChange={(e) => handleNotesChange(item.id, e.target.value)}
                className="ml-6 text-sm"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentChecklist;


import React, { useState } from 'react';
import { Plus, Search, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';
import { useNavigate } from 'react-router-dom';

// Mock employee data
const mockEmployees = [
  {
    id: 1,
    name: 'John Operator',
    email: 'john.operator@broadcast.com',
    position: 'Senior Broadcast Operator',
    department: 'Operations',
    status: 'Active',
    startDate: '2022-01-15',
    phone: '555-0123'
  },
  {
    id: 2,
    name: 'Sarah Engineer',
    email: 'sarah.engineer@broadcast.com',
    position: 'Broadcast Engineer',
    department: 'Engineering',
    status: 'Active',
    startDate: '2021-06-20',
    phone: '555-0124'
  },
  {
    id: 3,
    name: 'Mike Manager',
    email: 'mike.manager@broadcast.com',
    position: 'Operations Manager',
    department: 'Management',
    status: 'Active',
    startDate: '2020-03-10',
    phone: '555-0125'
  },
  {
    id: 4,
    name: 'Lisa Technician',
    email: 'lisa.tech@broadcast.com',
    position: 'Maintenance Technician',
    department: 'Engineering',
    status: 'On Leave',
    startDate: '2023-02-14',
    phone: '555-0126'
  }
];

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employeeId: number) => {
    navigate(`/employees/${employeeId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'On Leave':
        return 'text-amber-600 bg-amber-100';
      case 'Inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-2">Manage employee information and access</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredEmployees.length} of {employees.length} employees
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow 
                  key={employee.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleEmployeeClick(employee.id)}
                >
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmployeeClick(employee.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddEmployeeDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onEmployeeAdded={(newEmployee) => {
          setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
          setShowAddDialog(false);
        }}
      />
    </div>
  );
};

export default EmployeeManagement;

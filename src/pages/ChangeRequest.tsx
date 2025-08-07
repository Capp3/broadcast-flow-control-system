
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileText, Calendar, Clock, MapPin, User, Wrench, AlertCircle, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/settings-hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const changeRequestSchema = z.object({
  requester: z.string().min(1, 'Requester name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  facility: z.string().min(1, 'Facility is required'),
  changeType: z.string().min(1, 'Change type is required'),
  priority: z.string().min(1, 'Priority is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide a detailed description (minimum 20 characters)'),
  justification: z.string().min(20, 'Please provide justification for this change (minimum 20 characters)'),
  estimatedDuration: z.string().optional(),
  proposedDate: z.string().optional(),
  impactAssessment: z.string().min(10, 'Please assess the impact of this change (minimum 10 characters)'),
});

type ChangeRequestForm = z.infer<typeof changeRequestSchema>;

const ChangeRequest = () => {
  const { facilities } = useSettings();
  const { toast } = useToast();
  
  const form = useForm<ChangeRequestForm>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: {
      requester: 'John Operator',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      facility: '',
      changeType: '',
      priority: '',
      title: '',
      description: '',
      justification: '',
      estimatedDuration: '',
      proposedDate: '',
      impactAssessment: '',
    },
  });

  const changeTypes = [
    'Software Update',
    'Hardware Upgrade',
    'Configuration Change',
    'Security Update',
    'Performance Optimization',
    'Feature Addition',
    'System Migration',
    'Network Change',
    'Policy Update',
    'Maintenance Window'
  ];

  const priorities = [
    'Low',
    'Medium', 
    'High',
    'Critical'
  ];

  const onSubmit = (data: ChangeRequestForm) => {
    console.log('Change Request Submitted:', data);
    
    toast({
      title: "Change Request Submitted",
      description: `Change request "${data.title}" has been submitted for approval.`,
    });

    // Reset form after submission
    form.reset({
      requester: 'John Operator',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      facility: '',
      changeType: '',
      priority: '',
      title: '',
      description: '',
      justification: '',
      estimatedDuration: '',
      proposedDate: '',
      impactAssessment: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-blue-500" />
          Change Request
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Change Request Form
          </CardTitle>
          <CardDescription>
            Submit a request for planned changes that require approval. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Requester Field */}
                <FormField
                  control={form.control}
                  name="requester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Requester *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter requester name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Facility Field */}
                <FormField
                  control={form.control}
                  name="facility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Facility *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id.toString()}>
                              {facility.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Field */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Request Date *
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Field */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Request Time *
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Change Type Field */}
                <FormField
                  control={form.control}
                  name="changeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Change Type *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select change type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {changeTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority Field */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Priority *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Proposed Date Field */}
                <FormField
                  control={form.control}
                  name="proposedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Proposed Implementation Date
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estimated Duration Field */}
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Estimated Duration
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 2 hours, 1 day" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Change Title *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief descriptive title for the change"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of the proposed change, including what will be modified, steps involved, and expected outcomes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Justification Field */}
              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Justification *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain why this change is necessary, what problem it solves, or what improvement it provides..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Impact Assessment Field */}
              <FormField
                control={form.control}
                name="impactAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact Assessment *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Assess the potential impact on operations, users, systems, or services. Include any risks or dependencies..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                >
                  Clear Form
                </Button>
                <Button type="submit">
                  Submit Change Request
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-sm">Change Request Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• Change requests are reviewed and approved by management before implementation</p>
            <p>• Approved changes are converted to service tickets and assigned to engineers</p>
            <p>• All changes are tracked and documented for compliance and audit purposes</p>
            <p>• Critical priority changes may require emergency approval procedures</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeRequest;

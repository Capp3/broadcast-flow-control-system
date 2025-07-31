
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertTriangle, Calendar, Clock, MapPin, User, FileText, Timer, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const incidentReportSchema = z.object({
  reporter: z.string().min(1, 'Reporter name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  facility: z.string().min(1, 'Facility is required'),
  incidentType: z.string().min(1, 'Incident type is required'),
  timeDown: z.string().optional(),
  notes: z.string().min(10, 'Please provide detailed notes (minimum 10 characters)'),
  followUpRequired: z.string().min(1, 'Please indicate if follow-up is required'),
});

type IncidentReportForm = z.infer<typeof incidentReportSchema>;

const IncidentReport = () => {
  const { facilities, incidentTypes } = useSettings();
  const { toast } = useToast();
  
  const form = useForm<IncidentReportForm>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      reporter: 'John Operator', // Default to logged in user
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      facility: '',
      incidentType: '',
      timeDown: '',
      notes: '',
      followUpRequired: '',
    },
  });

  const onSubmit = (data: IncidentReportForm) => {
    console.log('Incident Report Submitted:', data);
    
    toast({
      title: "Incident Report Submitted",
      description: `Incident report for ${data.facility} has been recorded successfully.`,
    });

    // Reset form after submission
    form.reset({
      reporter: 'John Operator',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      facility: '',
      incidentType: '',
      timeDown: '',
      notes: '',
      followUpRequired: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          Report Incident
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Incident Report Form
          </CardTitle>
          <CardDescription>
            Please provide detailed information about the incident. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reporter Field */}
                <FormField
                  control={form.control}
                  name="reporter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Reporter *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter reporter name" {...field} />
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
                        Date *
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
                        Time *
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Incident Type Field */}
                <FormField
                  control={form.control}
                  name="incidentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Incident Type *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {incidentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Down Field */}
                <FormField
                  control={form.control}
                  name="timeDown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        Time Down (optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 2 hours, 30 minutes" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Follow-up Required Field */}
              <FormField
                control={form.control}
                name="followUpRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Required *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select if follow-up is needed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes - Requires Review/Investigation</SelectItem>
                        <SelectItem value="no">No - For Record Only</SelectItem>
                        <SelectItem value="urgent">Urgent - Immediate Action Required</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes Field */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Notes *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a detailed description of the incident, including what happened, when it occurred, any actions taken, and any other relevant information..."
                        className="min-h-[120px]"
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
                  Submit Incident Report
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 text-sm">Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• All incident reports are automatically logged and timestamped</p>
            <p>• Reports marked as requiring follow-up will be reviewed by management</p>
            <p>• For urgent incidents, consider also notifying your supervisor immediately</p>
            <p>• Facilities and incident types can be managed in the Settings page</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentReport;

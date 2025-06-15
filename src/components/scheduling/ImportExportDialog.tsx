
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportExportDialog = ({ open, onOpenChange }: ImportExportDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to import",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would parse the file and import the data
    console.log('Importing file:', selectedFile.name);
    toast({
      title: "Import successful",
      description: `Imported schedule data from ${selectedFile.name}`
    });
    onOpenChange(false);
  };

  const handleExport = () => {
    // In real app, this would generate and download the file
    console.log('Exporting schedule as:', exportFormat);
    toast({
      title: "Export successful",
      description: `Schedule exported as ${exportFormat.toUpperCase()} file`
    });
  };

  const downloadTemplate = (format: 'csv' | 'xlsx') => {
    // In real app, this would download a template file
    console.log('Downloading template:', format);
    toast({
      title: "Template downloaded",
      description: `Downloaded ${format.toUpperCase()} template file`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import/Export Schedule</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="import" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Schedule Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File (CSV or XLSX)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="mt-1"
                  />
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Import Format Requirements:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Title, Start Date, Start Time, End Time, Facility are required</li>
                    <li>• Date format: YYYY-MM-DD</li>
                    <li>• Time format: HH:MM (24-hour)</li>
                    <li>• Use "Event" or "Shift" in Type column</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate('csv')}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download CSV Template
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate('xlsx')}
                    className="flex-1"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Excel Template
                  </Button>
                </div>

                <Button onClick={handleImport} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Schedule
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Schedule Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Export Format</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={exportFormat === 'csv' ? 'default' : 'outline'}
                      onClick={() => setExportFormat('csv')}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant={exportFormat === 'xlsx' ? 'default' : 'outline'}
                      onClick={() => setExportFormat('xlsx')}
                      className="flex-1"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Export includes:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• All events and shifts for the current week</li>
                    <li>• Staff assignments (if applicable)</li>
                    <li>• Facility assignments</li>
                    <li>• Recurrence information</li>
                  </ul>
                </div>

                <Button onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export as {exportFormat.toUpperCase()}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;

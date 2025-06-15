
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar,
  CheckCircle,
  FileSpreadsheet,
  Database
} from 'lucide-react';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onOpenChange }) => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['csv']);
  const [selectedData, setSelectedData] = useState<string[]>(['failures', 'performance']);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: 'csv', name: 'CSV File', description: 'Comma-separated values for Excel/Sheets', icon: FileSpreadsheet },
    { id: 'xlsx', name: 'Excel File', description: 'Microsoft Excel format (.xlsx)', icon: FileSpreadsheet },
    { id: 'json', name: 'JSON Data', description: 'Structured data for APIs', icon: Database },
    { id: 'pdf', name: 'PDF Report', description: 'Formatted report document', icon: FileText }
  ];

  const dataTypes = [
    { id: 'failures', name: 'Failure Data', description: 'System failures and incidents' },
    { id: 'performance', name: 'Performance Metrics', description: 'KPIs and performance data' },
    { id: 'payroll', name: 'Payroll Data', description: 'Employee hours and compensation' },
    { id: 'costs', name: 'Cost Analysis', description: 'Financial and budget data' },
    { id: 'utilization', name: 'Resource Utilization', description: 'Department and employee utilization' }
  ];

  const handleFormatToggle = (formatId: string, checked: boolean) => {
    if (checked) {
      setSelectedFormats(prev => [...prev, formatId]);
    } else {
      setSelectedFormats(prev => prev.filter(id => id !== formatId));
    }
  };

  const handleDataToggle = (dataId: string, checked: boolean) => {
    if (checked) {
      setSelectedData(prev => [...prev, dataId]);
    } else {
      setSelectedData(prev => prev.filter(id => id !== dataId));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    console.log('Exporting data:', {
      formats: selectedFormats,
      dataTypes: selectedData
    });

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsExporting(false);
    onOpenChange(false);
    
    // Show success message (in real app, this would trigger actual downloads)
    alert('Export completed! Files have been generated and are ready for download.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Report Data
          </DialogTitle>
          <DialogDescription>
            Select the data types and formats you want to export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Formats */}
          <div>
            <Label className="text-base font-medium">Export Formats</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {exportFormats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <div key={format.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={format.id}
                      checked={selectedFormats.includes(format.id)}
                      onCheckedChange={(checked) => handleFormatToggle(format.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <label htmlFor={format.id} className="font-medium cursor-pointer">
                          {format.name}
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">{format.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Types */}
          <div>
            <Label className="text-base font-medium">Data to Export</Label>
            <div className="space-y-2 mt-3">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={dataType.id}
                    checked={selectedData.includes(dataType.id)}
                    onCheckedChange={(checked) => handleDataToggle(dataType.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor={dataType.id} className="font-medium cursor-pointer">
                      {dataType.name}
                    </label>
                    <p className="text-xs text-muted-foreground">{dataType.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Export Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Date Range: Last 6 months</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="text-sm">
                  {selectedFormats.length} format{selectedFormats.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm">
                  {selectedData.length} data type{selectedData.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-3">
              {selectedFormats.map(format => (
                <Badge key={format} variant="secondary" className="text-xs">
                  {format.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={selectedFormats.length === 0 || selectedData.length === 0 || isExporting}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;

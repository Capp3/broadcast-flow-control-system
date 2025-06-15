
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Upload, 
  Image,
  FileText,
  Palette,
  Save,
  Eye
} from 'lucide-react';

const ReportSettings = () => {
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    companyName: 'Broadcast Operations Inc.',
    reportHeader: 'System Performance Report',
    footerText: 'Confidential - Internal Use Only',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    contactInfo: 'support@broadcastops.com | (555) 123-4567'
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log('Saving report settings:', settings);
    // This would save the settings to the backend
  };

  const previewReport = () => {
    console.log('Generating report preview with current settings');
    // This would generate a preview of the report with current settings
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Company Branding
            </CardTitle>
            <CardDescription>
              Customize the appearance of client-facing reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Label htmlFor="report-header">Report Header</Label>
              <Input
                id="report-header"
                value={settings.reportHeader}
                onChange={(e) => handleSettingChange('reportHeader', e.target.value)}
                placeholder="Enter report header text"
              />
            </div>

            <div>
              <Label htmlFor="footer-text">Footer Text</Label>
              <Textarea
                id="footer-text"
                value={settings.footerText}
                onChange={(e) => handleSettingChange('footerText', e.target.value)}
                placeholder="Enter footer text"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="contact-info">Contact Information</Label>
              <Input
                id="contact-info"
                value={settings.contactInfo}
                onChange={(e) => handleSettingChange('contactInfo', e.target.value)}
                placeholder="Enter contact information"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Company Logo
            </CardTitle>
            <CardDescription>
              Upload your company logo for report headers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
              {companyLogo ? (
                <div className="text-center">
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="max-h-32 max-w-full object-contain mx-auto mb-4"
                  />
                  <p className="text-sm text-muted-foreground">Logo uploaded successfully</p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 2MB (Recommended: 300x100px)
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="mt-4 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                    placeholder="#64748b"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Templates
            </CardTitle>
            <CardDescription>
              Configure different report templates for various audiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Executive Summary</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  High-level overview for executives
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">KPI Metrics</Badge>
                  <Badge variant="outline">Trend Charts</Badge>
                  <Badge variant="outline">Cost Analysis</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Technical Report</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Detailed technical analysis for engineers
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Failure Details</Badge>
                  <Badge variant="outline">System Logs</Badge>
                  <Badge variant="outline">Performance Data</Badge>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Client Report</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Professional client-facing report
                </p>
                <div className="space-y-2">
                  <Badge variant="outline">Service Levels</Badge>
                  <Badge variant="outline">Uptime Charts</Badge>
                  <Badge variant="outline">Issue Summary</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={previewReport}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Report
        </Button>
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default ReportSettings;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Globe, Key, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EndpointConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EndpointConfigDialog = ({ open, onOpenChange }: EndpointConfigDialogProps) => {
  const [config, setConfig] = useState({
    endpointUrl: '',
    apiKey: '',
    updateInterval: 60,
    autoSync: false,
    lastSync: null as Date | null,
    isActive: false,
    customSchema: `{
  "events": [
    {
      "title": "string",
      "startDate": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "facility": "string",
      "type": "event|shift",
      "isRecurring": "boolean",
      "shifts": [
        {
          "title": "string",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "staffCount": "number"
        }
      ]
    }
  ]
}`
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    setTestStatus('testing');
    
    // Simulate API test
    setTimeout(() => {
      if (config.endpointUrl && config.endpointUrl.startsWith('http')) {
        setTestStatus('success');
        toast({
          title: "Connection successful",
          description: "Successfully connected to the endpoint"
        });
      } else {
        setTestStatus('error');
        toast({
          title: "Connection failed",
          description: "Please check your endpoint URL and API key",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleSyncNow = () => {
    if (!config.endpointUrl) {
      toast({
        title: "No endpoint configured",
        description: "Please configure an endpoint first",
        variant: "destructive"
      });
      return;
    }

    // Simulate sync
    setConfig(prev => ({ ...prev, lastSync: new Date() }));
    toast({
      title: "Sync completed",
      description: "Schedule data has been synchronized"
    });
  };

  const handleSave = () => {
    // In real app, this would save to backend/localStorage
    console.log('Saving endpoint config:', config);
    toast({
      title: "Configuration saved",
      description: "Endpoint configuration has been saved"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Endpoint Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="endpoint-url">Endpoint URL</Label>
                <Input
                  id="endpoint-url"
                  value={config.endpointUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, endpointUrl: e.target.value }))}
                  placeholder="https://your-api.com/schedule"
                />
              </div>

              <div>
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Your API key"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-sync">Auto Sync</Label>
                  <p className="text-sm text-gray-600">Automatically sync schedule data</p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={config.autoSync}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>

              {config.autoSync && (
                <div>
                  <Label htmlFor="update-interval">Update Interval (minutes)</Label>
                  <Input
                    id="update-interval"
                    type="number"
                    min="5"
                    max="1440"
                    value={config.updateInterval}
                    onChange={(e) => setConfig(prev => ({ ...prev, updateInterval: parseInt(e.target.value) }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {testStatus === 'success' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                    </>
                  )}
                  {testStatus === 'error' && (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <Badge variant="destructive">Connection Failed</Badge>
                    </>
                  )}
                  {testStatus === 'testing' && (
                    <>
                      <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                      <Badge variant="secondary">Testing...</Badge>
                    </>
                  )}
                  {testStatus === 'idle' && (
                    <Badge variant="outline">Not Tested</Badge>
                  )}
                </div>
                <Button onClick={handleTestConnection} disabled={testStatus === 'testing'}>
                  Test Connection
                </Button>
              </div>

              {config.lastSync && (
                <div className="mt-4 text-sm text-gray-600">
                  Last sync: {config.lastSync.toLocaleString()}
                </div>
              )}

              <div className="mt-4">
                <Button onClick={handleSyncNow} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* JSON Schema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Expected JSON Schema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="schema">Custom Schema (Optional)</Label>
                <Textarea
                  id="schema"
                  value={config.customSchema}
                  onChange={(e) => setConfig(prev => ({ ...prev, customSchema: e.target.value }))}
                  className="font-mono text-sm mt-2"
                  rows={15}
                />
              </div>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Integration Notes:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• The endpoint should return JSON data matching the schema above</li>
                  <li>• GET requests will be made to fetch schedule data</li>
                  <li>• All times should be in 24-hour format (HH:MM)</li>
                  <li>• Dates should be in YYYY-MM-DD format</li>
                  <li>• The system will merge imported data with existing schedules</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndpointConfigDialog;

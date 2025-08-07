
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { djangoApi } from '@/services/django-api';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(credentials.username, credentials.password);
      if (success) {
        navigate('/');
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const testConnection = async () => {
    try {
      console.log('Testing Django connection...');
      const result = await djangoApi.healthCheck();
      console.log('Health check result:', result);
      toast({
        title: "Connection successful",
        description: "Django backend is reachable",
      });
    } catch (error) {
      console.error('Connection test failed:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Cannot reach Django backend",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
            <Radio className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Broadcast Management System</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Lock className="h-4 w-4 mr-2" />
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={testConnection}
            >
              Test Django Connection
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Enter your Django credentials to access the system</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

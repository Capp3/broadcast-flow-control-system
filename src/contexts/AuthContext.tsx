import React, { createContext, useContext, useState, useEffect } from 'react';
import { DjangoUser, Profile } from '@/types/django';
import { djangoApi } from '@/services/django-api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: DjangoUser | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DjangoUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshUser = async () => {
    try {
      const currentUser = await djangoApi.getCurrentUser();
      setUser(currentUser);
      
      // Get user profile
      const profiles = await djangoApi.getProfiles();
      const userProfile = profiles.results?.find(p => p.user.id === currentUser.id);
      setProfile(userProfile || null);
    } catch (error) {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const loggedInUser = await djangoApi.login(username, password);
      setUser(loggedInUser);
      
      // Get user profile
      const profiles = await djangoApi.getProfiles();
      const userProfile = profiles.results?.find(p => p.user.id === loggedInUser.id);
      setProfile(userProfile || null);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedInUser.first_name || loggedInUser.username}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await djangoApi.logout();
      setUser(null);
      setProfile(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setProfile(null);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    profile,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
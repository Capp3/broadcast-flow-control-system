
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Top Navigation Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Broadcast Management System
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">John Operator</span>
                  <Button variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

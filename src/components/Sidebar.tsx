
import React from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  FileText, 
  AlertTriangle,
  BarChart3,
  Wrench,
  Shield,
  Home
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const mainMenuItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Time Keeping', url: '/time-keeping', icon: Clock },
    { title: 'Schedule', url: '/schedule', icon: Calendar },
    { title: 'Report Incident', url: '/incident-report', icon: AlertTriangle },
    { title: 'Change Request', url: '/change-request', icon: FileText },
    { title: 'System Check', url: '/system-check', icon: Wrench },
  ];

  const managementItems = [
    { title: 'Management Dashboard', url: '/management', icon: BarChart3 },
    { title: 'Employee Management', url: '/employees', icon: Users },
    { title: 'Scheduling', url: '/scheduling', icon: Calendar },
    { title: 'Reporting', url: '/reports', icon: FileText },
    { title: 'Settings', url: '/settings', icon: Settings },
  ];

  const engineeringItems = [
    { title: 'Engineering Dashboard', url: '/engineering', icon: Shield },
    { title: 'Service Tickets', url: '/service-tickets', icon: Wrench },
    { title: 'Incident Tickets', url: '/incident-tickets', icon: AlertTriangle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-blue-100 text-blue-900 font-medium border-r-2 border-blue-600" 
      : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="p-4 border-b">
        <SidebarTrigger className="mb-2" />
        {!collapsed && (
          <h2 className="font-bold text-lg text-gray-900">BMS</h2>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Engineering</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {engineeringItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${getNavClassName(item.url)}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

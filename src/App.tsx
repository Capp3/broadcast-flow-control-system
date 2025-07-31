
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TimeKeeping from "./pages/TimeKeeping";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import IncidentTickets from "./pages/IncidentTickets";
import ServiceTickets from "./pages/ServiceTickets";
import IncidentReport from "./pages/IncidentReport";
import ChangeRequest from "./pages/ChangeRequest";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeDetail from "./pages/EmployeeDetail";
import SystemCheck from "./pages/SystemCheck";
import Scheduling from "./pages/Scheduling";
import Engineering from "./pages/Engineering";
import Management from "./pages/Management";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/time-keeping" element={<ProtectedRoute><Layout><TimeKeeping /></Layout></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Layout><Schedule /></Layout></ProtectedRoute>} />
            <Route path="/incident-report" element={<ProtectedRoute><Layout><SettingsProvider><IncidentReport /></SettingsProvider></Layout></ProtectedRoute>} />
            <Route path="/change-request" element={<ProtectedRoute><Layout><SettingsProvider><ChangeRequest /></SettingsProvider></Layout></ProtectedRoute>} />
            <Route path="/system-check" element={<ProtectedRoute><Layout><SettingsProvider><SystemCheck /></SettingsProvider></Layout></ProtectedRoute>} />
            <Route path="/management" element={<ProtectedRoute><Layout><Management /></Layout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Layout><EmployeeManagement /></Layout></ProtectedRoute>} />
            <Route path="/employees/:id" element={<ProtectedRoute><Layout><EmployeeDetail /></Layout></ProtectedRoute>} />
            <Route path="/scheduling" element={<ProtectedRoute><Layout><SettingsProvider><Scheduling /></SettingsProvider></Layout></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout><SettingsProvider><Settings /></SettingsProvider></Layout></ProtectedRoute>} />
            <Route path="/engineering" element={<ProtectedRoute><Layout><Engineering /></Layout></ProtectedRoute>} />
            <Route path="/service-tickets" element={<ProtectedRoute><Layout><ServiceTickets /></Layout></ProtectedRoute>} />
            <Route path="/incident-tickets" element={<ProtectedRoute><Layout><IncidentTickets /></Layout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

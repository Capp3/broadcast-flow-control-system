
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
import TicketReview from "./pages/TicketReview";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeDetail from "./pages/EmployeeDetail";
import SystemCheck from "./pages/SystemCheck";
import Scheduling from "./pages/Scheduling";
import Engineering from "./pages/Engineering";
import { SettingsProvider } from "./contexts/SettingsContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/time-keeping" element={<Layout><TimeKeeping /></Layout>} />
            <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
            <Route path="/incident-report" element={<Layout><SettingsProvider><IncidentReport /></SettingsProvider></Layout>} />
            <Route path="/change-request" element={<Layout><SettingsProvider><ChangeRequest /></SettingsProvider></Layout>} />
            <Route path="/system-check" element={<Layout><SettingsProvider><SystemCheck /></SettingsProvider></Layout>} />
            <Route path="/management" element={<Layout><div>Management Dashboard - Coming Soon</div></Layout>} />
            <Route path="/employees" element={<Layout><EmployeeManagement /></Layout>} />
            <Route path="/employees/:id" element={<Layout><EmployeeDetail /></Layout>} />
            <Route path="/scheduling" element={<Layout><SettingsProvider><Scheduling /></SettingsProvider></Layout>} />
            <Route path="/ticket-review" element={<Layout><TicketReview /></Layout>} />
            <Route path="/reports" element={<Layout><div>Reports - Coming Soon</div></Layout>} />
            <Route path="/settings" element={<Layout><SettingsProvider><Settings /></SettingsProvider></Layout>} />
            <Route path="/engineering" element={<Layout><Engineering /></Layout>} />
            <Route path="/service-tickets" element={<Layout><ServiceTickets /></Layout>} />
            <Route path="/incident-tickets" element={<Layout><IncidentTickets /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

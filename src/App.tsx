
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TimeKeeping from "./pages/TimeKeeping";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import IncidentTickets from "./pages/IncidentTickets";
import ServiceTickets from "./pages/ServiceTickets";
import IncidentReport from "./pages/IncidentReport";
import { SettingsProvider } from "./contexts/SettingsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/time-keeping" element={<Layout><TimeKeeping /></Layout>} />
          <Route path="/schedule" element={<Layout><div>Schedule Page - Coming Soon</div></Layout>} />
          <Route path="/incident-report" element={<Layout><SettingsProvider><IncidentReport /></SettingsProvider></Layout>} />
          <Route path="/change-request" element={<Layout><div>Change Request Page - Coming Soon</div></Layout>} />
          <Route path="/system-check" element={<Layout><div>System Check Page - Coming Soon</div></Layout>} />
          <Route path="/management" element={<Layout><div>Management Dashboard - Coming Soon</div></Layout>} />
          <Route path="/employees" element={<Layout><div>Employee Management - Coming Soon</div></Layout>} />
          <Route path="/scheduling" element={<Layout><div>Scheduling - Coming Soon</div></Layout>} />
          <Route path="/reports" element={<Layout><div>Reports - Coming Soon</div></Layout>} />
          <Route path="/settings" element={<Layout><SettingsProvider><Settings /></SettingsProvider></Layout>} />
          <Route path="/engineering" element={<Layout><div>Engineering Dashboard - Coming Soon</div></Layout>} />
          <Route path="/service-tickets" element={<Layout><ServiceTickets /></Layout>} />
          <Route path="/incident-tickets" element={<Layout><IncidentTickets /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

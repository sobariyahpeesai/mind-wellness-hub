import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAppointments from "./pages/StudentAppointments";
import PsychologistDashboard from "./pages/PsychologistDashboard";
import PsychologistAppointments from "./pages/PsychologistAppointments";
import ReportDashboard from "./pages/ReportDashboard";
import CounselingFormPage from "./pages/CounselingFormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/appointments" element={<StudentAppointments />} />
          <Route path="/psychologist" element={<PsychologistDashboard />} />
          <Route path="/psychologist/appointments" element={<PsychologistAppointments />} />
          <Route path="/psychologist/reports" element={<ReportDashboard />} />
          <Route path="/psychologist/counseling" element={<CounselingFormPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

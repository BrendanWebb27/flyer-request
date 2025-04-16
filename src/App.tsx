
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RequestForm from "./pages/RequestForm";
import ActiveRequests from "./pages/ActiveRequests";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SupportDashboard from "./pages/SupportDashboard";
import { useProfileAccess } from "@/hooks/useProfileAccess";

const queryClient = new QueryClient();

// Route guard component for support-only routes
const SupportRoute = ({ children }: { children: JSX.Element }) => {
  // Use our custom hook to check support access
  const { getSupportAccess } = useProfileAccess();
  const hasAccess = getSupportAccess();
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Route guard component for regular users
const UserRoute = ({ children }: { children: JSX.Element }) => {
  // Use our custom hook to check if user is support staff
  const { isSupport } = useProfileAccess();
  
  if (isSupport) {
    return <Navigate to="/support" replace />;
  }
  
  return children;
};

const App = () => {
  // Use the hook to track support status changes
  const { isSupport } = useProfileAccess();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={
                <UserRoute>
                  <Dashboard />
                </UserRoute>
              } />
              <Route path="/request" element={<RequestForm />} />
              <Route path="/active" element={<ActiveRequests />} />
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/support" 
                element={
                  <SupportRoute>
                    <SupportDashboard />
                  </SupportRoute>
                } 
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

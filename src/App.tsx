
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

// Route guard for verified users only
const VerifiedRoute = ({ children }: { children: JSX.Element }) => {
  // Check if user is verified (has email verified)
  const isVerified = localStorage.getItem("emailVerified") === "true";
  
  if (!isVerified) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

const App = () => {
  // Use the hook to track support status changes
  const { isSupport } = useProfileAccess();

  // Check user verification status on app load
  useEffect(() => {
    // This will help maintain verification state between sessions
    const checkUserVerification = () => {
      const verifiedEmails = JSON.parse(localStorage.getItem('verifiedEmails') || '[]');
      const userEmail = localStorage.getItem('supportUserEmail');
      
      // If user email exists and is in verified list, auto-verify
      if (userEmail && verifiedEmails.includes(userEmail)) {
        localStorage.setItem("emailVerified", "true");
      }
    };
    
    checkUserVerification();
  }, []);

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
                  <VerifiedRoute>
                    <Dashboard />
                  </VerifiedRoute>
                </UserRoute>
              } />
              <Route path="/request" element={
                <VerifiedRoute>
                  <RequestForm />
                </VerifiedRoute>
              } />
              <Route path="/active" element={
                <VerifiedRoute>
                  <ActiveRequests />
                </VerifiedRoute>
              } />
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

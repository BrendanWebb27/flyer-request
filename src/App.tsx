
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
  
  console.log("SupportRoute check - hasAccess:", hasAccess);
  
  if (!hasAccess) {
    console.log("User does not have support access, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("User has support access, allowing access to support route");
  return children;
};

// Route guard component for regular users
const UserRoute = ({ children }: { children: JSX.Element }) => {
  // Use our custom hook to check if user is support staff
  const { isSupport } = useProfileAccess();
  
  console.log("UserRoute check - isSupport:", isSupport);
  
  if (isSupport) {
    console.log("Support user detected, redirecting to support dashboard");
    return <Navigate to="/support" replace />;
  }
  
  console.log("Regular user detected, allowing access to user route");
  return children;
};

// Route guard for verified users only
const VerifiedRoute = ({ children }: { children: JSX.Element }) => {
  // Check if user is verified (has email verified)
  const isVerified = localStorage.getItem("emailVerified") === "true";
  
  console.log("VerifiedRoute check - isVerified:", isVerified);
  
  if (!isVerified) {
    console.log("User is not verified, redirecting to profile");
    return <Navigate to="/profile" replace />;
  }
  
  console.log("User is verified, allowing access to protected route");
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
        console.log("Auto-verifying user email:", userEmail);
        localStorage.setItem("emailVerified", "true");
      }
      
      // Debug support access
      const supportAccess = localStorage.getItem("supportAccessGranted");
      console.log("App initialized - Support access:", supportAccess);
      console.log("isSupport from hook:", isSupport);
    };
    
    checkUserVerification();
  }, [isSupport]);

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

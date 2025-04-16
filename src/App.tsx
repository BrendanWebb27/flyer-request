
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

const queryClient = new QueryClient();

// Route guard component for support-only routes
const SupportRoute = ({ children }: { children: JSX.Element }) => {
  // User must be in the Support organization to access support routes
  const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
  
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  // State to trigger re-render when access changes
  const [isSupport, setIsSupport] = useState(false);
  
  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
      setIsSupport(hasAccess);
    };
    
    checkAccess();
    
    // Listen for localStorage changes
    window.addEventListener("storage", checkAccess);
    
    return () => {
      window.removeEventListener("storage", checkAccess);
    };
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
              <Route path="/dashboard" element={<Dashboard />} />
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

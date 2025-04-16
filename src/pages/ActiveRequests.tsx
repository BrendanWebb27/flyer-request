
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { RequestStatus } from "@/types/request";
import RequestsTabContent from "@/components/requests/RequestsTabContent";
import { useLocation, useNavigate } from "react-router-dom";

const ActiveRequests: React.FC = () => {
  const { toast } = useToast();
  const { 
    requests, 
    formatDate, 
    clearRequest, 
    undoClearRequest, 
    acceptRequest 
  } = useSupportRequests();
  const [recentlyCleared, setRecentlyCleared] = useState<{id: string, index: number} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // Use a ref for the refresh trigger to avoid re-renders
  const refreshTriggerRef = useRef(0);
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Check for support access
  const isSupport = localStorage.getItem("supportAccessGranted") === "true";
  
  // This would come from authentication in a real app
  const currentUserId = "user123";
  
  // Extract status from URL query params
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | null;
  const [activeTab, setActiveTab] = useState<string>(statusParam || "all");

  // Update URL when tab changes - with debouncing to prevent multiple updates
  const navigateDebounced = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (navigateDebounced.current) {
      clearTimeout(navigateDebounced.current);
    }
    
    navigateDebounced.current = setTimeout(() => {
      if (statusParam !== activeTab && activeTab !== "all") {
        navigate(`/active?status=${activeTab}`, { replace: true });
      } else if (statusParam !== activeTab && activeTab === "all") {
        navigate(`/active`, { replace: true });
      }
    }, 100);
    
    return () => {
      if (navigateDebounced.current) {
        clearTimeout(navigateDebounced.current);
      }
    };
  }, [activeTab, navigate, statusParam]);

  // Update active tab when URL changes
  useEffect(() => {
    if (statusParam && ["pending", "active", "completed"].includes(statusParam)) {
      setActiveTab(statusParam);
    } else if (statusParam === null) {
      setActiveTab("all");
    }
  }, [statusParam]);
  
  // Listen for request updates with reduced frequency
  useEffect(() => {
    const handleStorageChange = () => {
      refreshTriggerRef.current += 1;
      // Only update the state occasionally to avoid too many re-renders
      if (refreshTriggerRef.current % 3 === 0) {
        setRefreshCount(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    
    // Less frequent refresh interval
    const refreshInterval = setInterval(() => {
      refreshTriggerRef.current += 1;
      setRefreshCount(prev => prev + 1);
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, []);
  
  // Handle clearing a request
  const handleClearRequest = (id: string) => {
    const requestIndex = requests.findIndex(req => req.id === id);
    clearRequest(id);
    
    setRecentlyCleared({ id, index: requestIndex });
    
    toast({
      title: "Request Cleared",
      description: "Request has been cleared from your view",
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (recentlyCleared) {
              undoClearRequest(recentlyCleared.id, recentlyCleared.index);
              setRecentlyCleared(null);
              toast({
                title: "Request Restored",
                description: "Request has been restored to your view"
              });
            }
          }}
        >
          Undo
        </Button>
      )
    });
    
    // Clear the recently cleared item after a timeout
    setTimeout(() => {
      setRecentlyCleared(null);
    }, 10000); // 10 seconds
  };

  // Handle accepting a request with estimated time - with optimized updates
  const handleAcceptRequest = useCallback((id: string, data: { estimatedTime: string }) => {
    console.log("ActiveRequests: Accepting request", id, data);
    
    acceptRequest(id, { 
      assignedTo: "Current Support Staff", // In a real app, you'd get the current user's name
      estimatedTime: data.estimatedTime 
    });
    
    // After accepting, navigate to active tab
    setActiveTab("active");
    
    // Use replace to prevent history buildup
    navigate(`/active?status=active&t=${Date.now()}`, { replace: true });
    
    // Show a toast notification
    toast({
      title: "Request Accepted",
      description: `You'll arrive in ${data.estimatedTime}.`,
    });
    
    // Update the refresh counter to trigger a re-render
    refreshTriggerRef.current += 1;
    setRefreshCount(prev => prev + 1);
    
  }, [acceptRequest, navigate, toast]);

  // Filter requests based on user role
  const filteredRequests = React.useMemo(() => {
    if (!isSupport) {
      // For general users, only show their own requests
      return [...requests].filter(req => req.requestedBy === currentUserId);
    }
    // Support users see all requests without filtering by requestedBy
    return [...requests];
  }, [requests, isSupport, currentUserId, refreshCount]);

  // Only display tabs that the user has access to
  const availableTabs = isSupport 
    ? ["all", "pending", "active", "completed"] 
    : ["all", "pending", "active"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {availableTabs.map(tab => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== "all" && requests.filter(r => r.status === tab).length > 0 && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                  {requests.filter(r => r.status === tab).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div key={`tabs-content-${refreshCount}`}>
          {availableTabs.map((tab) => (
            <TabsContent key={`${tab}-content-${refreshCount}`} value={tab}>
              <RequestsTabContent
                requests={filteredRequests}
                status={tab as RequestStatus | "all"}
                formatDate={formatDate}
                onClearRequest={handleClearRequest}
                currentUserId={currentUserId}
                onAcceptRequest={isSupport ? handleAcceptRequest : undefined}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default ActiveRequests;

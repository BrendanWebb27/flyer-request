
import { useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { RequestStatus } from "@/types/request";

export const useActiveRequests = () => {
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

  // Update URL when tab changes
  const updateUrlWithActiveTab = useCallback(() => {
    if (statusParam !== activeTab && activeTab !== "all") {
      navigate(`/active?status=${activeTab}`, { replace: true });
    } else if (statusParam !== activeTab && activeTab === "all") {
      navigate(`/active`, { replace: true });
    }
  }, [activeTab, navigate, statusParam]);

  // Handle clearing a request
  const handleClearRequest = useCallback((id: string) => {
    const requestIndex = requests.findIndex(req => req.id === id);
    clearRequest(id);
    
    setRecentlyCleared({ id, index: requestIndex });
    
    toast({
      title: "Request Cleared",
      description: "Request has been cleared from your view",
      action: (
        <button 
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
        </button>
      )
    });
    
    // Clear the recently cleared item after a timeout
    setTimeout(() => {
      setRecentlyCleared(null);
    }, 10000); // 10 seconds
  }, [requests, clearRequest, toast, recentlyCleared, undoClearRequest]);

  // Handle accepting a request with estimated time
  const handleAcceptRequest = useCallback((id: string, data: { estimatedTime: string }) => {
    console.log("ActiveRequests: Accepting request", id, data);
    
    acceptRequest(id, { 
      assignedTo: "Current Support Staff", // In a real app, you'd get the current user's name
      estimatedTime: data.estimatedTime 
    });
    
    // Show a toast notification first
    toast({
      title: "Request Accepted",
      description: `You'll arrive in ${data.estimatedTime}.`,
    });
    
    // After accepting, navigate to active tab with a small delay to prevent UI glitches
    setTimeout(() => {
      setActiveTab("active");
      navigate(`/active?status=active`, { replace: true });
      
      // Update the refresh counter to trigger a re-render
      refreshTriggerRef.current += 1;
      setRefreshCount(prev => prev + 1);
    }, 200);
    
  }, [acceptRequest, navigate, toast]);

  // Force refresh when explicitly requested
  const handleRequestUpdated = useCallback(() => {
    console.log("ActiveRequests: Request update detected");
    refreshTriggerRef.current += 1;
    setRefreshCount(prev => prev + 1);
  }, []);

  // Filter requests based on user role
  const filteredRequests = requests.filter(req => {
    if (!isSupport) {
      // For general users, only show their own requests
      return req.requestedBy === currentUserId;
    }
    // Support users see all requests without filtering by requestedBy
    return true;
  });

  // Only display tabs that the user has access to
  const availableTabs = isSupport 
    ? ["all", "pending", "active", "completed"] 
    : ["all", "pending", "active"];

  return {
    activeTab,
    setActiveTab,
    filteredRequests,
    availableTabs,
    refreshCount,
    handleClearRequest,
    handleAcceptRequest,
    handleRequestUpdated,
    updateUrlWithActiveTab,
    formatDate,
    currentUserId,
    isSupport,
    requests
  };
};

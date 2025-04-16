
import { useState, useCallback, useRef, useEffect } from "react";
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
  const refreshTriggerRef = useRef(0);
  const [refreshCount, setRefreshCount] = useState(0);
  
  const isSupport = localStorage.getItem("supportAccessGranted") === "true";
  const currentUserId = "user123";
  
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | null;
  const [activeTab, setActiveTab] = useState<string>(statusParam || "all");

  // This effect ensures we're always in sync with URL parameters
  useEffect(() => {
    if (statusParam && statusParam !== activeTab) {
      console.log("Syncing activeTab with URL param:", statusParam);
      setActiveTab(statusParam);
    }
  }, [statusParam, activeTab]);

  // Listen for request status changes 
  useEffect(() => {
    const handleStatusChange = () => {
      console.log("Request status change detected, updating UI");
      setRefreshCount(prev => prev + 1);
    };
    
    window.addEventListener('requestStatusChanged', handleStatusChange);
    return () => window.removeEventListener('requestStatusChanged', handleStatusChange);
  }, []);

  const updateUrlWithActiveTab = useCallback(() => {
    if (statusParam !== activeTab && activeTab !== "all") {
      navigate(`/active?status=${activeTab}`, { replace: true });
    } else if (statusParam !== activeTab && activeTab === "all") {
      navigate(`/active`, { replace: true });
    }
  }, [activeTab, navigate, statusParam]);

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
    
    setTimeout(() => {
      setRecentlyCleared(null);
    }, 10000);
  }, [requests, clearRequest, toast, recentlyCleared, undoClearRequest]);

  const handleAcceptRequest = useCallback((id: string, data: { estimatedTime: string }) => {
    console.log("useActiveRequests: Handling accept for request", { id, data });
    console.log("Current requests before accept:", requests);
    
    try {
      // Accept the request
      acceptRequest(id, { 
        assignedTo: "Current Support Staff", 
        estimatedTime: data.estimatedTime 
      });
      
      console.log("After accept - Request should be updated");
      
      toast({
        title: "Request Accepted",
        description: `You'll arrive in ${data.estimatedTime}.`,
      });
      
      // Important: Force a refresh to update the component state
      setRefreshCount(prev => prev + 1);
      
      // Switch to active tab with a slight delay to allow state updates
      setTimeout(() => {
        console.log("Switching to active tab");
        setActiveTab("active");
        navigate(`/active?status=active`, { replace: true });
        
        // Force components to re-render again after navigation
        setRefreshCount(prev => prev + 1);
        
        console.log("After tab switch - Active tab:", "active");
        
        // Dispatch global event
        window.dispatchEvent(new Event('requestUpdated'));
      }, 300);
    } catch (error) {
      console.error("Error in handleAcceptRequest:", error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive"
      });
    }
    
  }, [acceptRequest, navigate, toast, requests]);

  const handleRequestUpdated = useCallback(() => {
    console.log("ActiveRequests: Request update detected");
    refreshTriggerRef.current += 1;
    setRefreshCount(prev => prev + 1);
  }, []);

  const filteredRequests = requests.filter(req => {
    if (!isSupport) {
      return req.requestedBy === currentUserId;
    }
    return true;
  });

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

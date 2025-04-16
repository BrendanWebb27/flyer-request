
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
    acceptRequest,
    completeRequest
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
    if (statusParam !== activeTab && statusParam) {
      console.log("Syncing activeTab with URL param:", statusParam);
      setActiveTab(statusParam);
    } else if (!statusParam && activeTab !== "all") {
      console.log("No status in URL, setting activeTab to all");
      setActiveTab("all");
    }
  }, [statusParam, location.search]);

  // Listen for request status changes 
  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      console.log("Request status change detected, updating UI");
      
      // Force a refresh after status changes
      setRefreshCount(prev => prev + 1);
      
      // Get details from the event if available
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        console.log("Status change details:", customEvent.detail);
        
        // If this is a request acceptance, update the tab to match
        if (customEvent.detail.newStatus === 'active') {
          setActiveTab('active');
          navigate(`/active?status=active`, { replace: true });
        }
        // If this is a request completion, update the tab to completed
        else if (customEvent.detail.newStatus === 'completed') {
          setActiveTab('completed');
          navigate(`/active?status=completed`, { replace: true });
        }
        
        // If forceUpdate flag is set, do an immediate refresh
        if (customEvent.detail.forceUpdate) {
          setTimeout(() => {
            setRefreshCount(prev => prev + 1);
          }, 100);
        }
      }
    };
    
    window.addEventListener('requestStatusChanged', handleStatusChange);
    return () => window.removeEventListener('requestStatusChanged', handleStatusChange);
  }, [navigate]);

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
    
    try {
      // Accept the request
      acceptRequest(id, { 
        assignedTo: "Current Support Staff", 
        estimatedTime: data.estimatedTime 
      });
      
      toast({
        title: "Request Accepted",
        description: `You'll arrive in ${data.estimatedTime}.`,
      });
      
      // Update the active tab to show active requests
      setActiveTab("active");
      setTimeout(() => {
        navigate(`/active?status=active`, { replace: true });
        
        // Force refresh to ensure UI updates
        setRefreshCount(prev => prev + 1);
        
        // Dispatch event for any other components that need to know
        window.dispatchEvent(new CustomEvent('requestStatusChanged', {
          detail: { id, newStatus: 'active', forceUpdate: true }
        }));
      }, 300);
      
    } catch (error) {
      console.error("Error in handleAcceptRequest:", error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive"
      });
    }
    
  }, [acceptRequest, navigate, toast]);

  const handleCompleteRequest = useCallback((id: string, note: { text: string, author: string }) => {
    console.log("useActiveRequests: Handling complete for request", { id, note });
    
    try {
      // Complete the request
      completeRequest(id, note);
      
      toast({
        title: "Request Completed",
        description: "The request has been marked as completed.",
      });
      
      // Update the active tab to show completed requests
      setActiveTab("completed");
      setTimeout(() => {
        navigate(`/active?status=completed`, { replace: true });
        
        // Force refresh to ensure UI updates
        setRefreshCount(prev => prev + 1);
      }, 300);
      
    } catch (error) {
      console.error("Error in handleCompleteRequest:", error);
      toast({
        title: "Error",
        description: "Failed to complete request. Please try again.",
        variant: "destructive"
      });
    }
  }, [completeRequest, navigate, toast]);

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
    handleCompleteRequest,
    handleRequestUpdated,
    updateUrlWithActiveTab,
    formatDate,
    currentUserId,
    isSupport,
    requests
  };
};

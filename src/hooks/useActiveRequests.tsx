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
  const refreshTriggerRef = useRef(0);
  const [refreshCount, setRefreshCount] = useState(0);
  
  const isSupport = localStorage.getItem("supportAccessGranted") === "true";
  const currentUserId = "user123";
  
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | null;
  const [activeTab, setActiveTab] = useState<string>(statusParam || "all");

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
      console.log("Before accept - Current active tab:", activeTab);
      console.log("Before accept - Current requests:", requests);
      
      acceptRequest(id, { 
        assignedTo: "Current Support Staff", 
        estimatedTime: data.estimatedTime 
      });
      
      console.log("After accept - Requests updated");
      
      toast({
        title: "Request Accepted",
        description: `You'll arrive in ${data.estimatedTime}.`,
      });
      
      setRefreshCount(prev => prev + 1);
      
      setTimeout(() => {
        console.log("Switching to active tab");
        setActiveTab("active");
        navigate(`/active?status=active`, { replace: true });
        refreshTriggerRef.current += 1;
        
        console.log("After tab switch - Active tab:", activeTab);
      }, 300);
    } catch (error) {
      console.error("Error in handleAcceptRequest:", error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive"
      });
    }
    
  }, [acceptRequest, navigate, toast, requests, activeTab]);

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

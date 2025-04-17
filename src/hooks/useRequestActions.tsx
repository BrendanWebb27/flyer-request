
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupportRequests } from "@/hooks/useSupportRequests";

export const useRequestActions = (setRefreshCount: React.Dispatch<React.SetStateAction<number>>, setActiveTab: (tab: string) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    requests,
    clearRequest,
    undoClearRequest,
    acceptRequest: acceptRequestApi,
    completeRequest: completeRequestApi
  } = useSupportRequests();
  
  const [recentlyCleared, setRecentlyCleared] = useState<{id: string, index: number} | null>(null);

  // Handle clearing requests with undo functionality
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

  // Handle accepting requests
  const handleAcceptRequest = useCallback((id: string, data: { estimatedTime: string }) => {
    console.log("useRequestActions: Handling accept for request", { id, data });
    
    try {
      acceptRequestApi(id, { 
        assignedTo: "Current Support Staff", 
        estimatedTime: data.estimatedTime 
      });
      
      toast({
        title: "Request Accepted",
        description: `You'll arrive in ${data.estimatedTime}.`,
      });
      
      setActiveTab("active");
      setTimeout(() => {
        navigate(`/active?status=active`, { replace: true });
        
        setRefreshCount(prev => prev + 1);
        
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
  }, [acceptRequestApi, navigate, toast, setActiveTab, setRefreshCount]);

  // Handle completing requests - removed auto-navigation to completed tab
  const handleCompleteRequest = useCallback((id: string, note: { text: string, author: string }) => {
    console.log("useRequestActions: Handling complete for request", { id, note });
    
    try {
      completeRequestApi(id, note);
      
      toast({
        title: "Request Completed",
        description: "The request has been marked as completed.",
      });
      
      // Refresh the data without changing tabs or navigating
      setRefreshCount(prev => prev + 1);
      
      // Notify other components about the status change
      window.dispatchEvent(new CustomEvent('requestStatusChanged', {
        detail: { id, newStatus: 'completed', forceUpdate: true }
      }));
      
    } catch (error) {
      console.error("Error in handleCompleteRequest:", error);
      toast({
        title: "Error",
        description: "Failed to complete request. Please try again.",
        variant: "destructive"
      });
    }
  }, [completeRequestApi, toast, setRefreshCount]);

  return {
    handleClearRequest,
    handleAcceptRequest,
    handleCompleteRequest
  };
};

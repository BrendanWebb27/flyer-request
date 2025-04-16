
import { useState, useCallback, useRef, useEffect } from "react";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import { useRequestTab } from "@/hooks/useRequestTab";
import { useRequestActions } from "@/hooks/useRequestActions";

export const useActiveRequests = () => {
  const { requests, formatDate } = useSupportRequests();
  const { activeTab, setActiveTab, updateUrlWithActiveTab } = useRequestTab();
  const refreshTriggerRef = useRef(0);
  const [refreshCount, setRefreshCount] = useState(0);
  
  const { isSupport } = useProfileAccess();
  const currentUserId = "user123";
  
  // Initialize the request actions
  const { 
    handleClearRequest, 
    handleAcceptRequest, 
    handleCompleteRequest 
  } = useRequestActions(setRefreshCount, setActiveTab);

  // Handle request update events
  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      console.log("Request status change detected, updating UI");
      
      setRefreshCount(prev => prev + 1);
      
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        console.log("Status change details:", customEvent.detail);
        
        if (customEvent.detail.newStatus === 'active') {
          setActiveTab('active');
        } else if (customEvent.detail.newStatus === 'completed') {
          setActiveTab('completed');
        }
        
        if (customEvent.detail.forceUpdate) {
          setTimeout(() => {
            setRefreshCount(prev => prev + 1);
          }, 100);
        }
      }
    };
    
    window.addEventListener('requestStatusChanged', handleStatusChange);
    return () => window.removeEventListener('requestStatusChanged', handleStatusChange);
  }, [setActiveTab]);

  // Handle request updates
  const handleRequestUpdated = useCallback(() => {
    console.log("ActiveRequests: Request update detected");
    refreshTriggerRef.current += 1;
    setRefreshCount(prev => prev + 1);
  }, []);

  // Filter requests for current user if not support
  const filteredRequests = requests.filter(req => {
    if (!isSupport) {
      return req.requestedBy === currentUserId;
    }
    return true;
  });

  // Define available tabs based on user role
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

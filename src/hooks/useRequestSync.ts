
import { useEffect } from "react";
import { loadRequests } from "@/utils/requestPersistence";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event) => {
      console.log("useRequestSync: Storage change detected", 
        event instanceof StorageEvent ? event.key : "custom event");
      
      // Always try to load the latest data from localStorage
      const savedRequests = loadRequests();
      setRequests(savedRequests);
      
      // Only for StorageEvent, check if it's specifically our key
      if (event instanceof StorageEvent) {
        if (event.key === 'requestsUpdate' || event.key === 'lastRequestUpdate') {
          try {
            const parsedRequests = event.key === 'requestsUpdate' && event.newValue
              ? JSON.parse(event.newValue)
              : loadRequests(); // Fallback to loading if key is different
            
            setRequests(parsedRequests);
            console.log("useRequestSync: Updated requests from storage event", parsedRequests);
            
            // Force metrics to update with small delay to ensure state consistency
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('metricsUpdate'));
            }, 50);
          } catch (err) {
            console.error("Error parsing requests from storage:", err);
            
            // Try loading directly as fallback
            const directRequests = loadRequests();
            setRequests(directRequests);
          }
        }
      } else {
        // For custom events, ensure metrics update
        window.dispatchEvent(new CustomEvent('metricsUpdate'));
      }
    };
    
    // Set up event listeners with priority handling
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    window.addEventListener('metricsUpdate', () => {
      const refreshedRequests = loadRequests();
      setRequests(refreshedRequests);
    });
    
    // Initial load
    const initialRequests = loadRequests();
    setRequests(initialRequests);
    console.log("useRequestSync: Initial requests loaded", initialRequests);
    
    // Set up periodic refresh to ensure data is always current
    const refreshInterval = setInterval(() => {
      const refreshedRequests = loadRequests();
      setRequests(refreshedRequests);
    }, 2000); // Check every 2 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
      window.removeEventListener('metricsUpdate', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, [setRequests]);
};

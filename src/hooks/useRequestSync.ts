
import { useEffect, useRef, useState } from "react";
import { loadRequests } from "@/utils/requestPersistence";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  const lastUpdate = useRef(0);
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set up mounted flag for cleanup
    isMounted.current = true;
    
    // Use a debounced update function to prevent multiple rapid updates
    const updateRequests = (forceUpdate = false) => {
      const now = Date.now();
      // Only update if sufficient time has passed (debounce) or if forced
      if (forceUpdate || now - lastUpdate.current > 300) {
        if (isMounted.current) {
          const savedRequests = loadRequests();
          setRequests(savedRequests);
          lastUpdate.current = now;
          console.log("useRequestSync: Updated requests", savedRequests);
        }
      }
    };

    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      const isStorageEvent = event instanceof StorageEvent;
      console.log("useRequestSync: Event detected", 
        isStorageEvent ? event.key : "custom event");
      
      if (isStorageEvent) {
        // For storage events, only update if it's our specific keys
        if (event.key === 'requestsUpdate' || event.key === 'lastRequestUpdate') {
          updateRequests(true);
        }
      } else {
        // For custom events, update with a small delay to prevent racing
        setTimeout(() => updateRequests(true), 50);
      }
    };
    
    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    window.addEventListener('metricsUpdate', () => updateRequests(true));
    
    // Initial load
    updateRequests(true);
    
    // Use a less frequent refresh interval
    const refreshInterval = setInterval(() => {
      updateRequests();
    }, 5000); // Check every 5 seconds instead of 2
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
      window.removeEventListener('metricsUpdate', handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, [setRequests]);
};

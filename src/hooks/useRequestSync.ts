
import { useEffect, useRef, useState } from "react";
import { loadRequests } from "@/utils/requestPersistence";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  const lastUpdate = useRef(0);
  const isMounted = useRef(true);
  const updateInProgress = useRef(false);
  
  useEffect(() => {
    // Set up mounted flag for cleanup
    isMounted.current = true;
    
    // Use a debounced update function to prevent multiple rapid updates
    const updateRequests = (forceUpdate = false) => {
      if (updateInProgress.current) {
        return; // Prevent concurrent updates
      }
      
      const now = Date.now();
      // Only update if sufficient time has passed (debounce) or if forced
      if (forceUpdate || now - lastUpdate.current > 300) {
        if (isMounted.current) {
          try {
            updateInProgress.current = true;
            const savedRequests = loadRequests();
            setRequests(savedRequests);
            lastUpdate.current = now;
            console.log("useRequestSync: Updated requests", savedRequests);
          } finally {
            updateInProgress.current = false;
          }
        }
      }
    };

    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      const isStorageEvent = event instanceof StorageEvent;
      
      if (isStorageEvent) {
        // For storage events, only update if it's our specific keys
        if (event.key === 'requestsUpdate' || event.key === 'lastRequestUpdate') {
          updateRequests(true);
        }
      } else {
        // For custom events, use a small delay
        setTimeout(() => updateRequests(true), 100);
      }
    };
    
    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    window.addEventListener('metricsUpdate', handleStorageChange);
    
    // Initial load with a small delay to allow other components to initialize
    setTimeout(() => updateRequests(true), 50);
    
    // Use a less frequent refresh interval
    const refreshInterval = setInterval(() => {
      updateRequests();
    }, 5000); // Check every 5 seconds
    
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

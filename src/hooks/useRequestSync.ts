
import { useEffect, useRef, useState } from "react";
import { loadRequests, forceRequestSync } from "@/utils/requestPersistence";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  const lastUpdate = useRef(0);
  const isMounted = useRef(true);
  const updateInProgress = useRef(false);
  const updateInterval = useRef<number | null>(null);
  
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
            console.log("useRequestSync: Updated requests", savedRequests.length);
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
        if (event.key === 'requestsUpdate' || event.key === 'lastRequestUpdate' || 
            event.key === 'requestSyncTrigger' || event.key?.startsWith('request_notification_')) {
          console.log("Storage change detected:", event.key);
          updateRequests(true);
        }
      } else {
        // For custom events, check if it's a force sync
        const customEvent = event as CustomEvent;
        const forceSync = customEvent.detail?.forceSync;
        
        // Use a small delay for normal updates, immediate for force syncs
        if (forceSync) {
          updateRequests(true);
        } else {
          setTimeout(() => updateRequests(true), 100);
        }
      }
    };
    
    // For force sync events (more aggressive refresh)
    const handleForceSync = () => {
      console.log("Force sync event received");
      updateRequests(true);
      
      // Refresh again after a sequence of small delays for race conditions
      setTimeout(() => updateRequests(true), 300);
      setTimeout(() => updateRequests(true), 1000);
    };
    
    // Set up event listeners with more types of events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    window.addEventListener('requestsForceSync', handleForceSync);
    window.addEventListener('metricsUpdate', handleStorageChange);
    
    // Initial load with multiple attempts
    updateRequests(true);
    setTimeout(() => updateRequests(true), 200);
    setTimeout(() => updateRequests(true), 500);
    
    // Set up a more frequent refresh interval
    updateInterval.current = window.setInterval(() => {
      updateRequests(true); // Force update on interval
    }, 2000); // Check every 2 seconds (more frequent than before)
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
      window.removeEventListener('requestsForceSync', handleForceSync);
      window.removeEventListener('metricsUpdate', handleStorageChange);
      
      if (updateInterval.current !== null) {
        clearInterval(updateInterval.current);
      }
    };
  }, [setRequests]);
  
  // Expose a function to force refresh
  const forceRefresh = () => {
    console.log("Manual force refresh triggered");
    forceRequestSync();
    
    // Additional direct sync attempt
    const savedRequests = loadRequests();
    setRequests(savedRequests);
  };
  
  return { forceRefresh };
};

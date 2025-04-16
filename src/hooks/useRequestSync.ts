
import { useEffect, useRef, useState } from "react";
import { loadRequests, forceRequestSync } from "@/utils/requestPersistence";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  const lastUpdate = useRef(0);
  const isMounted = useRef(true);
  const updateInProgress = useRef(false);
  const updateInterval = useRef<number | null>(null);
  const forceSyncTimeout = useRef<number | null>(null);
  
  useEffect(() => {
    // Set up mounted flag for cleanup
    isMounted.current = true;
    
    // Log initial sync for debugging
    console.log("useRequestSync: Setting up request synchronization");
    
    // Use a debounced update function to prevent multiple rapid updates
    const updateRequests = (forceUpdate = false) => {
      if (updateInProgress.current) {
        console.log("useRequestSync: Update already in progress, skipping");
        return; // Prevent concurrent updates
      }
      
      const now = Date.now();
      // Only update if sufficient time has passed (debounce) or if forced
      if (forceUpdate || now - lastUpdate.current > 300) {
        if (isMounted.current) {
          try {
            updateInProgress.current = true;
            const savedRequests = loadRequests();
            console.log(`useRequestSync: Updating with ${savedRequests.length} requests`);
            
            // Check if email is set in local storage
            const userEmail = localStorage.getItem("supportUserEmail");
            console.log(`useRequestSync: Current user email - ${userEmail || "not set"}`);
            
            setRequests(savedRequests);
            lastUpdate.current = now;
          } catch (error) {
            console.error("useRequestSync: Error updating requests", error);
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
      if (forceSyncTimeout.current !== null) {
        clearTimeout(forceSyncTimeout.current);
      }
      
      forceSyncTimeout.current = window.setTimeout(() => {
        updateRequests(true);
        forceSyncTimeout.current = window.setTimeout(() => {
          updateRequests(true);
        }, 1000);
      }, 300);
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
    }, 1500); // Check every 1.5 seconds (more frequent than before)
    
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
      
      if (forceSyncTimeout.current !== null) {
        clearTimeout(forceSyncTimeout.current);
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

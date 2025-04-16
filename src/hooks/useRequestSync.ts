
import { useEffect, useRef } from "react";
import { loadRequests, forceRequestSync } from "@/utils/requestPersistence";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  const lastUpdate = useRef(0);
  const isMounted = useRef(true);
  const updateInProgress = useRef(false);
  const updateInterval = useRef<number | null>(null);
  const forceSyncTimeout = useRef<number | null>(null);
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  
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

    // Setup BroadcastChannel for more reliable cross-tab communication (like Uber's real-time system)
    try {
      broadcastChannel.current = new BroadcastChannel('request_updates');
      broadcastChannel.current.onmessage = (event) => {
        console.log("BroadcastChannel message received:", event.data);
        if (event.data.type === 'new_request' || event.data.type === 'request_update') {
          updateRequests(true);
        }
      };
    } catch (e) {
      console.log('BroadcastChannel not supported, falling back to storage events only');
    }

    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      const isStorageEvent = event instanceof StorageEvent;
      
      if (isStorageEvent) {
        // For storage events, only update if it's our specific keys
        if (event.key === 'requestsUpdate' || event.key === 'lastRequestUpdate' || 
            event.key === 'requestSyncTrigger' || event.key === 'requestUpdatePing' ||
            event.key?.startsWith('request_notification_')) {
          console.log("Storage change detected:", event.key);
          updateRequests(true);
        }
      } else {
        // For custom events, check if it's a force sync or high priority
        const customEvent = event as CustomEvent;
        const forceSync = customEvent.detail?.forceSync;
        const urgent = customEvent.detail?.urgent;
        
        // Use immediate update for urgent/forced syncs
        if (forceSync || urgent) {
          updateRequests(true);
        } else {
          setTimeout(() => updateRequests(true), 50); // Very short delay
        }
      }
    };
    
    // For force sync events (more aggressive refresh)
    const handleForceSync = () => {
      console.log("Force sync event received");
      updateRequests(true);
      
      // Perform multiple refreshes at staggered intervals (similar to ride-sharing app updates)
      if (forceSyncTimeout.current !== null) {
        clearTimeout(forceSyncTimeout.current);
      }
      
      // Multiple rapid updates to ensure we catch all changes
      forceSyncTimeout.current = window.setTimeout(() => {
        updateRequests(true);
        forceSyncTimeout.current = window.setTimeout(() => {
          updateRequests(true);
          forceSyncTimeout.current = window.setTimeout(() => {
            updateRequests(true);
          }, 500);
        }, 200);
      }, 50);
    };
    
    // Set up event listeners with more types of events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    window.addEventListener('requestsForceSync', handleForceSync);
    window.addEventListener('metricsUpdate', handleStorageChange);
    window.addEventListener('requestUpdatePing', handleForceSync);
    
    // Initial load with multiple attempts
    updateRequests(true);
    setTimeout(() => updateRequests(true), 100);
    setTimeout(() => updateRequests(true), 300);
    
    // Set up a more frequent refresh interval (similar to ride-sharing real-time updates)
    updateInterval.current = window.setInterval(() => {
      updateRequests(false); // Regular update on interval
    }, 1000); // Check every second (more frequent for real-time feel)
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
      window.removeEventListener('requestsForceSync', handleForceSync);
      window.removeEventListener('metricsUpdate', handleStorageChange);
      window.removeEventListener('requestUpdatePing', handleForceSync);
      
      if (updateInterval.current !== null) {
        clearInterval(updateInterval.current);
      }
      
      if (forceSyncTimeout.current !== null) {
        clearTimeout(forceSyncTimeout.current);
      }

      // Close broadcast channel if available
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
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

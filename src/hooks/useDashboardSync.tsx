
import { useState, useEffect, useCallback } from 'react';
import { forceRequestSync } from "@/utils/requestPersistence";

/**
 * Custom hook to handle request synchronization for the dashboard
 */
export const useDashboardSync = () => {
  const [syncTimer, setSyncTimer] = useState(0);
  
  // Force sync requests
  const forceSyncRequests = useCallback(() => {
    console.log("Support Dashboard: Forcing request sync");
    forceRequestSync();
    setSyncTimer(prev => prev + 1);
  }, []);
  
  // Set up periodic sync
  useEffect(() => {
    // Force sync on component mount
    forceSyncRequests();
    
    // Set up interval for periodic syncing
    const syncInterval = setInterval(() => {
      forceSyncRequests();
    }, 10000); // Sync every 10 seconds
    
    return () => clearInterval(syncInterval);
  }, [forceSyncRequests]);

  return {
    syncTimer,
    forceSyncRequests
  };
};

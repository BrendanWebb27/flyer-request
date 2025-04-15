
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
        if (event.key === 'requestsUpdate' && event.newValue) {
          try {
            const parsedRequests = JSON.parse(event.newValue);
            setRequests(parsedRequests);
            console.log("useRequestSync: Updated requests from storage event", parsedRequests);
          } catch (err) {
            console.error("Error parsing requests from storage:", err);
          }
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    
    // Initial load
    const initialRequests = loadRequests();
    setRequests(initialRequests);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
    };
  }, [setRequests]);
};

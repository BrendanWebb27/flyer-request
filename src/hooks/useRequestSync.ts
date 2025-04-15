
import { useEffect } from "react";

type SetRequestsFunction = React.Dispatch<React.SetStateAction<any[]>>;

export const useRequestSync = (setRequests: SetRequestsFunction) => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event) => {
      if (event instanceof StorageEvent) {
        if (event.key === 'requestsUpdate' && event.newValue) {
          setRequests(JSON.parse(event.newValue));
        }
      } else {
        // If it's a custom event, just refresh from localStorage
        const savedRequests = localStorage.getItem('requestsUpdate');
        if (savedRequests) {
          setRequests(JSON.parse(savedRequests));
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('requestUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('requestUpdated', handleStorageChange);
    };
  }, [setRequests]);
};

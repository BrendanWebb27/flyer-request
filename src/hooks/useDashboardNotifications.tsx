
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

/**
 * Custom hook to handle notifications for the support dashboard
 */
export const useDashboardNotifications = (
  activeTab: string, 
  forceSyncRequests: () => void
) => {
  const [newRequestCount, setNewRequestCount] = useState(0);
  const navigate = useNavigate();

  // Handle new request notifications
  useEffect(() => {
    const handleNewRequest = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.request) {
        const request = customEvent.detail.request;
        
        // Show notification using Sonner toast for a more visible notification
        toast.success(`New Request: ${request.id}`, {
          description: `From: ${request.requestedBy} - Location: ${request.location}`,
          duration: 5000,
          action: {
            label: "View",
            onClick: () => {
              // Navigate to pending tab
              navigate("/support?status=pending");
              // Force refresh
              forceSyncRequests();
            }
          }
        });
        
        // Play sound for notification (optional)
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Audio play prevented by browser policy'));
        } catch (e) {
          console.log('Audio notification not supported');
        }
        
        // Increment new request counter
        setNewRequestCount(prev => prev + 1);
      }
    };
    
    // Listen for new request events
    window.addEventListener('supportNewRequest', handleNewRequest);
    
    // Listen for storage events that might indicate new requests
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('request_notification_')) {
        try {
          const data = JSON.parse(event.newValue || '{}');
          if (data.type === 'new_request') {
            // Force a refresh when a new request comes in
            forceSyncRequests();
            setNewRequestCount(prev => prev + 1);
          }
        } catch (e) {
          console.error('Error parsing notification data', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('supportNewRequest', handleNewRequest);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [forceSyncRequests, navigate]);

  // Reset notification counter
  const resetNotificationCount = useCallback(() => {
    setNewRequestCount(0);
  }, []);

  return {
    newRequestCount,
    resetNotificationCount
  };
};

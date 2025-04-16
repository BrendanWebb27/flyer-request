
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

/**
 * Custom hook to handle notifications for the support dashboard
 */
export const useDashboardNotifications = (
  activeTab: string, 
  forceSyncRequests: () => void
) => {
  const [newRequestCount, setNewRequestCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle new request notifications
  useEffect(() => {
    const handleNewRequest = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.request) {
        const request = customEvent.detail.request;
        
        // Show notification using shadcn/ui toast
        toast({
          title: `New Request: ${request.id}`,
          description: `From: ${request.requestedBy} - Location: ${request.location}`,
          action: (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              navigate("/support?status=pending");
              forceSyncRequests();
            }}>
              <Bell className="h-4 w-4" />
              <span>View</span>
            </div>
          ),
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
  }, [forceSyncRequests, navigate, toast]);

  // Reset notification counter
  const resetNotificationCount = useCallback(() => {
    setNewRequestCount(0);
  }, []);

  return {
    newRequestCount,
    resetNotificationCount
  };
};

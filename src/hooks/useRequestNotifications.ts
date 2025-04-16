
import { useEffect, useRef } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { getNotifiedRequests, addNotifiedRequest } from "@/utils/requestPersistence";
import { getSubscription } from "@/utils/pushNotifications";
import { useProfileAccess } from "@/hooks/useProfileAccess";

export const useRequestNotifications = (requests: Request[]) => {
  const { toast } = useToast();
  const previousRequests = useRef<Request[]>([]);
  const { isSupport } = useProfileAccess();
  
  useEffect(() => {
    const notifiedRequests = getNotifiedRequests();
    const subscription = getSubscription();
    
    // Compare current requests with previous requests to detect new requests and status changes
    const prevRequestIds = previousRequests.current.map(r => r.id);
    
    requests.forEach(request => {
      const prevRequest = previousRequests.current.find(r => r.id === request.id);
      
      // Check for new pending requests (only for support users)
      const isNewPendingRequest = 
        isSupport && 
        request.status === 'pending' && 
        !prevRequestIds.includes(request.id) && 
        !notifiedRequests.includes(request.id);
      
      // Check for status changes
      const statusChanged = prevRequest && prevRequest.status !== request.status;
      
      // Check for assigned requests (for regular users)
      const newlyAssigned = 
        !isSupport && 
        request.status === 'active' && 
        request.assignedTo && 
        request.estimatedArrival && 
        !notifiedRequests.includes(request.id);
      
      // Notify support users on new pending requests
      if (isNewPendingRequest) {
        toast({
          title: "New Request",
          description: `New request ${request.id} from ${request.requestedBy} needs attention.`,
        });
        
        // If push notification subscription exists, send to Supabase edge function
        if (subscription) {
          sendPushNotification({
            title: "New Request",
            body: `New request ${request.id} from ${request.requestedBy} needs attention.`,
            url: `/support?status=pending`,
            requestId: request.id
          });
        }
        
        addNotifiedRequest(request.id);
      }
      
      // Notify on assigned requests for non-support users
      if (newlyAssigned) {
        toast({
          title: "Request Accepted",
          description: `Your request has been accepted and assigned to ${request.assignedTo}. Estimated arrival: ${request.estimatedArrival}.`,
        });
        
        // If push notification subscription exists, send to Supabase edge function
        if (subscription) {
          sendPushNotification({
            title: "Request Accepted",
            body: `Your request has been accepted and assigned to ${request.assignedTo}. Estimated arrival: ${request.estimatedArrival}.`,
            url: `/active?status=active`,
            requestId: request.id
          });
        }
        
        addNotifiedRequest(request.id);
      }
      
      // Notify on status changes (excluding the initial pending notification)
      if (statusChanged && !newlyAssigned && prevRequest) {
        // Show in-app toast
        toast({
          title: `Request Status Updated`,
          description: `Request ${request.id} status changed from ${prevRequest.status} to ${request.status}`,
        });
        
        // If push notification subscription exists and it's a completion notice, send it
        if (subscription && request.status === 'completed') {
          const targetUser = isSupport ? "Support team" : "You";
          sendPushNotification({
            title: "Request Completed",
            body: `${targetUser}r request ${request.id} has been completed.`,
            url: `/active?status=completed`,
            requestId: request.id
          });
        }
      }
    });
    
    // Update the previous requests ref
    previousRequests.current = [...requests];
  }, [requests, toast, isSupport]);
};

// Send push notification through Supabase edge function
async function sendPushNotification(notification: {
  title: string;
  body: string;
  url?: string;
  requestId: string;
}) {
  try {
    const subscription = getSubscription();
    if (!subscription) return;
    
    await fetch('https://your-app-id.supabase.co/functions/v1/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabaseAccessToken')}`
      },
      body: JSON.stringify({
        subscription,
        notification,
        userId: localStorage.getItem('userId')
      })
    });
    
    console.log('Push notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}


import { useEffect, useRef } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { getNotifiedRequests, addNotifiedRequest } from "@/utils/requestPersistence";
import { getSubscription } from "@/utils/pushNotifications";

export const useRequestNotifications = (requests: Request[]) => {
  const { toast } = useToast();
  const previousRequests = useRef<Request[]>([]);
  
  useEffect(() => {
    const notifiedRequests = getNotifiedRequests();
    const isSupport = localStorage.getItem("supportAccessGranted") === "true";
    const subscription = getSubscription();
    
    if (isSupport) return;
    
    // Compare current requests with previous requests to detect status changes
    requests.forEach(request => {
      const prevRequest = previousRequests.current.find(r => r.id === request.id);
      
      const statusChanged = prevRequest && prevRequest.status !== request.status;
      const newlyAssigned = 
        request.status === 'active' && 
        request.assignedTo && 
        request.estimatedArrival && 
        !notifiedRequests.includes(request.id);
      
      // Notify on newly assigned requests
      if (newlyAssigned) {
        // Show in-app toast
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
      
      // Notify on status changes
      if (statusChanged && !newlyAssigned) {
        // Show in-app toast
        toast({
          title: `Request Status Updated`,
          description: `Request ${request.id} status changed to ${request.status}`,
        });
        
        // If push notification subscription exists, send to Supabase edge function
        if (subscription && request.status === 'completed') {
          sendPushNotification({
            title: "Request Completed",
            body: `Your request ${request.id} has been completed.`,
            url: `/active?status=completed`,
            requestId: request.id
          });
        }
      }
    });
    
    // Update the previous requests ref
    previousRequests.current = [...requests];
  }, [requests, toast]);
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


import { useEffect, useRef } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { getNotifiedRequests, addNotifiedRequest } from "@/utils/requestPersistence";

export const useRequestNotifications = (requests: Request[]) => {
  const { toast } = useToast();
  const previousRequests = useRef<Request[]>([]);
  
  useEffect(() => {
    const notifiedRequests = getNotifiedRequests();
    const isSupport = localStorage.getItem("supportAccessGranted") === "true";
    
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
        toast({
          title: "Request Accepted",
          description: `Your request has been accepted and assigned to ${request.assignedTo}. Estimated arrival: ${request.estimatedArrival}.`,
        });
        
        addNotifiedRequest(request.id);
      }
      
      // Notify on status changes
      if (statusChanged && !newlyAssigned) {
        toast({
          title: `Request Status Updated`,
          description: `Request ${request.id} status changed to ${request.status}`,
        });
      }
    });
    
    // Update the previous requests ref
    previousRequests.current = [...requests];
  }, [requests, toast]);
};

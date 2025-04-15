
import { useEffect } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { getNotifiedRequests, addNotifiedRequest } from "@/utils/requestPersistence";

export const useRequestNotifications = (requests: Request[]) => {
  const { toast } = useToast();
  
  useEffect(() => {
    const notifiedRequests = getNotifiedRequests();
    const isSupport = localStorage.getItem("supportAccessGranted") === "true";
    
    if (isSupport) return;
    
    requests.forEach(request => {
      if (
        request.status === 'active' && 
        request.assignedTo && 
        request.estimatedArrival && 
        !notifiedRequests.includes(request.id)
      ) {
        toast({
          title: "Request Accepted",
          description: `Your request has been accepted and assigned to ${request.assignedTo}. Estimated arrival: ${request.estimatedArrival}.`,
        });
        
        addNotifiedRequest(request.id);
      }
    });
  }, [requests, toast]);
};

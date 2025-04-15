import { useState, useEffect } from "react";
import { Request, RequestStatus, Note } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { initialRequests } from "@/data/mockRequests";
import { formatDate, countRequestsByStatus } from "@/utils/requestUtils";

export const useSupportRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [clearedRequests, setClearedRequests] = useState<Request[]>([]);

  // Use localStorage to show notification for accepted requests
  useEffect(() => {
    // Check for newly assigned requests
    const notifiedRequests = JSON.parse(localStorage.getItem('notifiedRequests') || '[]');
    const isSupport = localStorage.getItem("supportAccessGranted") === "true";
    
    // Skip notifications if user is support staff
    if (isSupport) return;
    
    requests.forEach(request => {
      // If request is active, has an assigned person, and hasn't been notified yet
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
        
        // Add to notified list
        notifiedRequests.push(request.id);
        localStorage.setItem('notifiedRequests', JSON.stringify(notifiedRequests));
      }
    });
  }, [requests, toast]);

  const acceptRequest = (id: string, data: { assignedTo: string; estimatedTime: string }) => {
    setRequests(prevRequests => 
      prevRequests.map(request =>
        request.id === id ? { 
          ...request, 
          status: "active" as RequestStatus, 
          assignedTo: data.assignedTo,
          estimatedArrival: data.estimatedTime 
        } : request
      )
    );
    
    // Force an update to localStorage to trigger UI refresh
    localStorage.setItem('lastRequestUpdate', new Date().toISOString());
  };

  const completeRequest = (id: string, note?: { text: string, author: string }) => {
    setRequests(
      requests.map(request => {
        if (request.id === id) {
          const updatedRequest: Request = { 
            ...request, 
            status: "completed" as RequestStatus,
            completedAt: new Date().toISOString()
          };
          
          if (note) {
            updatedRequest.notes = [
              ...(request.notes || []), 
              {
                ...note,
                timestamp: new Date().toISOString()
              }
            ];
          }
          
          return updatedRequest;
        }
        return request;
      })
    );
    
    toast({
      title: "Request Completed",
      description: `Request ${id} has been marked as completed`,
    });
    
    // Force an update to localStorage to trigger UI refresh
    localStorage.setItem('lastRequestUpdate', new Date().toISOString());
  };

  const clearRequest = (id: string) => {
    const requestToClear = requests.find(r => r.id === id);
    if (requestToClear) {
      // Store the request in case we need to restore it
      setClearedRequests([...clearedRequests, requestToClear]);
      
      // Remove from active list
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  const undoClearRequest = (id: string, index: number) => {
    const requestToRestore = clearedRequests.find(r => r.id === id);
    if (requestToRestore) {
      // Add back to the requests at the original position if possible
      const newRequests = [...requests];
      
      if (index >= 0 && index <= newRequests.length) {
        newRequests.splice(index, 0, requestToRestore);
      } else {
        newRequests.push(requestToRestore);
      }
      
      setRequests(newRequests);
      setClearedRequests(clearedRequests.filter(r => r.id !== id));
    }
  };

  const addNote = (id: string, note: { text: string, author: string }) => {
    setRequests(
      requests.map(request => {
        if (request.id === id) {
          return {
            ...request,
            notes: [
              ...(request.notes || []),
              {
                ...note,
                timestamp: new Date().toISOString()
              } as Note
            ]
          };
        }
        return request;
      })
    );
  };

  return {
    requests,
    acceptRequest,
    completeRequest,
    clearRequest,
    undoClearRequest,
    addNote,
    formatDate,
    countByStatus: (status: RequestStatus) => countRequestsByStatus(requests, status)
  };
};

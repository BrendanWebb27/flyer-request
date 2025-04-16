
import { useState, useCallback, useEffect } from "react";
import { Request, RequestStatus } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { loadRequests, saveRequests } from "@/utils/requestPersistence";
import { acceptRequest, completeRequest, addNoteToRequest } from "@/utils/requestOperations";
import { formatDate } from "@/utils/requestUtils";
import { useRequestNotifications } from "@/hooks/useRequestNotifications";
import { useRequestSync } from "@/hooks/useRequestSync";

// Helper function for counting requests by status
const countRequestsByStatus = (requests: Request[], status: RequestStatus | "all") => {
  if (status === "all") return requests.length;
  return requests.filter(r => r.status === status).length;
};

// Helper to count completed requests today
const countCompletedToday = (requests: Request[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  
  return requests.filter(request => {
    if (request.status !== "completed" || !request.completedAt) return false;
    const completedDate = new Date(request.completedAt);
    return completedDate >= today;
  }).length;
};

export const useSupportRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(() => loadRequests());
  const [clearedRequests, setClearedRequests] = useState<Request[]>([]);

  // Hook to handle notifications for requests
  useRequestNotifications(requests);
  
  // Hook to sync requests across tabs/components
  useRequestSync(setRequests);

  // Calculate request metrics (memoized when requests change)
  const metrics = useCallback(() => {
    return {
      total: requests.length,
      pending: countRequestsByStatus(requests, "pending"),
      active: countRequestsByStatus(requests, "active"),
      completed: countRequestsByStatus(requests, "completed"),
      completedToday: countCompletedToday(requests)
    };
  }, [requests]);

  const handleAcceptRequest = (id: string, data: { assignedTo: string; estimatedTime: string }) => {
    const updatedRequests = acceptRequest(requests, id, data);
    setRequests(updatedRequests);
    
    toast({
      title: "Request Accepted",
      description: `Request ${id} has been moved to active status.`,
    });
  };

  const handleCompleteRequest = (id: string, note?: { text: string, author: string }) => {
    const updatedRequests = completeRequest(requests, id, note);
    setRequests(updatedRequests);
    
    toast({
      title: "Request Completed",
      description: `Request ${id} has been marked as completed`,
    });
  };

  const clearRequest = (id: string) => {
    const requestToClear = requests.find(r => r.id === id);
    if (requestToClear) {
      setClearedRequests([...clearedRequests, requestToClear]);
      
      const updatedRequests = requests.filter(r => r.id !== id);
      setRequests(updatedRequests);
      saveRequests(updatedRequests);
    }
  };

  const undoClearRequest = (id: string, index: number) => {
    const requestToRestore = clearedRequests.find(r => r.id === id);
    if (requestToRestore) {
      const newRequests = [...requests];
      
      if (index >= 0 && index <= newRequests.length) {
        newRequests.splice(index, 0, requestToRestore);
      } else {
        newRequests.push(requestToRestore);
      }
      
      setRequests(newRequests);
      saveRequests(newRequests);
      setClearedRequests(clearedRequests.filter(r => r.id !== id));
    }
  };

  const handleAddNote = (id: string, note: { text: string, author: string }) => {
    const updatedRequests = addNoteToRequest(requests, id, note);
    setRequests(updatedRequests);
  };

  return {
    requests,
    acceptRequest: handleAcceptRequest,
    completeRequest: handleCompleteRequest,
    clearRequest,
    undoClearRequest,
    addNote: handleAddNote,
    formatDate,
    countByStatus: (status: RequestStatus | "all") => countRequestsByStatus(requests, status),
    metrics: metrics()
  };
};


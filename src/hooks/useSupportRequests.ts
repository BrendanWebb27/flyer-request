
import { useState, useCallback, useEffect } from "react";
import { Request, RequestStatus } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { loadRequests, saveRequests } from "@/utils/requestPersistence";
import { acceptRequest, completeRequest, addNoteToRequest } from "@/utils/requestOperations";
import { formatDate } from "@/utils/requestUtils";
import { useRequestNotifications } from "@/hooks/useRequestNotifications";
import { useRequestSync } from "@/hooks/useRequestSync";
import { initialRequests } from "@/data/mockRequests";

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
  const [requests, setRequests] = useState<Request[]>(() => {
    // Initialize with mock requests if localStorage is empty
    const savedRequests = loadRequests();
    console.log("Initial loading of requests:", savedRequests.length);
    if (savedRequests.length === 0) {
      console.log("No requests found in localStorage, initializing with mock data");
      saveRequests(initialRequests);
      return initialRequests;
    }
    return savedRequests;
  });
  const [clearedRequests, setClearedRequests] = useState<Request[]>([]);

  // Hook to handle notifications for requests
  useRequestNotifications(requests);
  
  // Hook to sync requests across tabs/components
  useRequestSync(setRequests);

  // Force load initial requests if empty
  useEffect(() => {
    if (requests.length === 0) {
      console.log("No requests found, loading initial data");
      setRequests(initialRequests);
      saveRequests(initialRequests);
    }
  }, [requests.length]);

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
    saveRequests(updatedRequests);
    
    toast({
      title: "Request Accepted",
      description: `Request ${id} has been moved to active status.`,
    });
  };

  const handleCompleteRequest = (id: string, note?: { text: string, author: string }) => {
    const updatedRequests = completeRequest(requests, id, note);
    setRequests(updatedRequests);
    saveRequests(updatedRequests);
    
    toast({
      title: "Request Completed",
      description: `Request ${id} has been marked as completed`,
    });
  };

  const clearRequest = (id: string) => {
    console.log("Clearing request:", id);
    const requestToClear = requests.find(r => r.id === id);
    if (requestToClear) {
      setClearedRequests(prev => [...prev, requestToClear]);
      
      const updatedRequests = requests.filter(r => r.id !== id);
      setRequests(updatedRequests);
      saveRequests(updatedRequests);
      
      console.log("Request cleared successfully");
    } else {
      console.log("Request not found for clearing");
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
      setClearedRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleAddNote = (id: string, note: { text: string, author: string }) => {
    const updatedRequests = addNoteToRequest(requests, id, note);
    setRequests(updatedRequests);
    saveRequests(updatedRequests);
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

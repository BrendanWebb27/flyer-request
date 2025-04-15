
import { useState, useEffect } from "react";
import { Request, RequestStatus, Note } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { initialRequests } from "@/data/mockRequests";
import { formatDate, countRequestsByStatus } from "@/utils/requestUtils";

export const useSupportRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(() => {
    // Try to load from localStorage first
    const savedRequests = localStorage.getItem('requestsUpdate');
    return savedRequests ? JSON.parse(savedRequests) : initialRequests;
  });
  const [clearedRequests, setClearedRequests] = useState<Request[]>([]);

  useEffect(() => {
    const notifiedRequests = JSON.parse(localStorage.getItem('notifiedRequests') || '[]');
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
        
        notifiedRequests.push(request.id);
        localStorage.setItem('notifiedRequests', JSON.stringify(notifiedRequests));
      }
    });
  }, [requests, toast]);

  // Effect to listen for storage events from other components
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
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const acceptRequest = (id: string, data: { assignedTo: string; estimatedTime: string }) => {
    console.log("Before update - Request status for", id, ":", requests.find(req => req.id === id)?.status);
    
    const updatedRequests = requests.map(request => {
      if (request.id === id) {
        console.log("Updating request status to active for ID:", id);
        return { 
          ...request, 
          status: "active" as RequestStatus, 
          assignedTo: data.assignedTo,
          estimatedArrival: data.estimatedTime 
        };
      }
      return request;
    });

    console.log("After update - Updated requests:", updatedRequests);
    console.log("After update - Request status for", id, ":", updatedRequests.find(req => req.id === id)?.status);
    
    // Save to localStorage before updating state to ensure consistency
    localStorage.setItem('requestsUpdate', JSON.stringify(updatedRequests));
    
    // Update state after localStorage to ensure they're in sync
    setRequests(updatedRequests);
    
    // Update timestamp for change detection
    localStorage.setItem('lastRequestUpdate', new Date().toISOString());
    
    // Dispatch a custom event to force updates across components
    window.dispatchEvent(new CustomEvent('requestUpdated', { detail: { id } }));
    
    // Also dispatch a storage event for components listening for that
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'requestsUpdate',
      newValue: JSON.stringify(updatedRequests)
    }));
    
    toast({
      title: "Request Accepted",
      description: `Request ${id} has been moved to active status.`,
    });
  };

  const completeRequest = (id: string, note?: { text: string, author: string }) => {
    const updatedRequests = requests.map(request => {
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
    });
    
    setRequests(updatedRequests);
    localStorage.setItem('requestsUpdate', JSON.stringify(updatedRequests));
    
    toast({
      title: "Request Completed",
      description: `Request ${id} has been marked as completed`,
    });
    
    localStorage.setItem('lastRequestUpdate', new Date().toISOString());
    
    // Dispatch event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'requestsUpdate',
      newValue: JSON.stringify(updatedRequests)
    }));
  };

  const clearRequest = (id: string) => {
    const requestToClear = requests.find(r => r.id === id);
    if (requestToClear) {
      setClearedRequests([...clearedRequests, requestToClear]);
      
      const updatedRequests = requests.filter(r => r.id !== id);
      setRequests(updatedRequests);
      localStorage.setItem('requestsUpdate', JSON.stringify(updatedRequests));
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
      localStorage.setItem('requestsUpdate', JSON.stringify(newRequests));
      setClearedRequests(clearedRequests.filter(r => r.id !== id));
    }
  };

  const addNote = (id: string, note: { text: string, author: string }) => {
    const updatedRequests = requests.map(request => {
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
    });
    
    setRequests(updatedRequests);
    localStorage.setItem('requestsUpdate', JSON.stringify(updatedRequests));
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

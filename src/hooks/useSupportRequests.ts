
import { useState, useEffect } from "react";
import { Request, RequestStatus } from "@/components/support/RequestsTable";
import { useToast } from "@/hooks/use-toast";
import { Note } from "@/types/request";

// Initial mock data
const initialRequests: Request[] = [
  {
    id: "REQ-1234",
    location: "Building A, Room 105",
    details: "Need assistance with carrying boxes to the mail room",
    createdAt: "2025-04-15T09:30:00Z",
    status: "active",
    estimatedDuration: "15 minutes",
    assignedTo: "John Doe",
    estimatedArrival: "10 minutes",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1235",
    location: "Building B, Conference Room 3",
    details: "Help required with setting up projector for presentation",
    createdAt: "2025-04-15T10:15:00Z",
    status: "active",
    estimatedDuration: "30 minutes",
    assignedTo: "Sarah Johnson",
    estimatedArrival: "5 minutes",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1236",
    location: "Building C, Cafeteria",
    details: "Need assistance with food delivery for event",
    createdAt: "2025-04-15T08:45:00Z",
    status: "pending",
    estimatedDuration: "45 minutes",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1237",
    location: "Building A, Room 302",
    details: "Assist with moving furniture for event setup",
    createdAt: "2025-04-15T11:20:00Z",
    status: "pending",
    estimatedDuration: "30 minutes",
    requestedBy: "user456",
    notes: []
  },
  {
    id: "REQ-1238",
    location: "Building D, Lobby",
    details: "Delivery of package from mailroom",
    createdAt: "2025-04-15T09:15:00Z",
    status: "pending",
    estimatedDuration: "10 minutes",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1239",
    location: "Building A, Room 201",
    details: "Technical assistance with projector",
    createdAt: "2025-04-15T13:45:00Z",
    status: "completed",
    estimatedDuration: "15 minutes",
    assignedTo: "Mike Wilson",
    requestedBy: "user123",
    notes: [{
      text: "Fixed HDMI connection issue",
      timestamp: "2025-04-15T14:15:00Z",
      author: "Mike Wilson"
    }]
  }
];

export const useSupportRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [clearedRequests, setClearedRequests] = useState<Request[]>([]);

  // Use localStorage to show notification for accepted requests
  useEffect(() => {
    // Check for newly assigned requests
    const notifiedRequests = JSON.parse(localStorage.getItem('notifiedRequests') || '[]');
    
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
    setRequests(
      requests.map(request =>
        request.id === id ? { 
          ...request, 
          status: "active" as RequestStatus, 
          assignedTo: data.assignedTo,
          estimatedArrival: data.estimatedTime 
        } : request
      )
    );
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
              }
            ]
          };
        }
        return request;
      })
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const countByStatus = (status: RequestStatus) => {
    return requests.filter(r => r.status === status).length;
  };

  return {
    requests,
    acceptRequest,
    completeRequest,
    formatDate,
    countByStatus,
    clearRequest,
    undoClearRequest,
    addNote
  };
};

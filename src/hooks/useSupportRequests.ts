
import { useState } from "react";
import { Request, RequestStatus } from "@/components/support/RequestsTable";
import { useToast } from "@/hooks/use-toast";

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
    estimatedArrival: "10 minutes"
  },
  {
    id: "REQ-1235",
    location: "Building B, Conference Room 3",
    details: "Help required with setting up projector for presentation",
    createdAt: "2025-04-15T10:15:00Z",
    status: "active",
    estimatedDuration: "30 minutes",
    assignedTo: "Sarah Johnson",
    estimatedArrival: "5 minutes"
  },
  {
    id: "REQ-1236",
    location: "Building C, Cafeteria",
    details: "Need assistance with food delivery for event",
    createdAt: "2025-04-15T08:45:00Z",
    status: "pending",
    estimatedDuration: "45 minutes"
  },
  {
    id: "REQ-1237",
    location: "Building A, Room 302",
    details: "Assist with moving furniture for event setup",
    createdAt: "2025-04-15T11:20:00Z",
    status: "pending",
    estimatedDuration: "30 minutes"
  },
  {
    id: "REQ-1238",
    location: "Building D, Lobby",
    details: "Delivery of package from mailroom",
    createdAt: "2025-04-15T09:15:00Z",
    status: "pending",
    estimatedDuration: "10 minutes"
  }
];

export const useSupportRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const acceptRequest = (id: string, data: { assignedTo: string; estimatedTime: string }) => {
    setRequests(
      requests.map(request =>
        request.id === id ? { 
          ...request, 
          status: "active", 
          assignedTo: data.assignedTo,
          estimatedArrival: data.estimatedTime 
        } : request
      )
    );
  };

  const completeRequest = (id: string) => {
    setRequests(
      requests.map(request =>
        request.id === id ? { ...request, status: "completed" } : request
      )
    );
    
    toast({
      title: "Request Completed",
      description: `Request ${id} has been marked as completed`,
    });
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
    countByStatus
  };
};

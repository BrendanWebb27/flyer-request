
import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { RequestStatus, Request } from "@/types/request";
import RequestCard from "./RequestCard";

interface RequestsTabContentProps {
  requests: Request[];
  status: RequestStatus | "all";
  formatDate: (date: string) => string;
  onClearRequest: (id: string) => void;
  currentUserId: string;
  onAcceptRequest?: (id: string, data: { estimatedTime: string }) => void;
  onRequestUpdated?: () => void; // Callback to notify parent of updates
}

const RequestsTabContent: React.FC<RequestsTabContentProps> = ({
  requests,
  status,
  formatDate,
  onClearRequest,
  currentUserId,
  onAcceptRequest,
  onRequestUpdated
}) => {
  const [localRequests, setLocalRequests] = useState<Request[]>([]);
  
  // Update local requests when prop requests change
  useEffect(() => {
    setLocalRequests(requests);
    console.log("RequestsTabContent: Requests updated from props", requests);
  }, [requests]);
  
  // Filter requests based on tab
  const filteredRequests = React.useMemo(() => {
    console.log("Filtering requests for status:", status);
    console.log("Available requests:", localRequests);
    
    if (status === "all") {
      return [...localRequests]; 
    }
    return localRequests.filter(request => request.status === status);
  }, [localRequests, status]);
  
  // Log when filtered requests change
  useEffect(() => {
    console.log("Filtered requests updated:", filteredRequests);
  }, [filteredRequests]);
  
  // Listen for global request updates
  useEffect(() => {
    const handleRequestUpdate = () => {
      console.log("RequestsTabContent: Global request update detected");
      if (onRequestUpdated) {
        onRequestUpdated();
      }
    };
    
    window.addEventListener('requestUpdated', handleRequestUpdate);
    window.addEventListener('storage', handleRequestUpdate);
    
    return () => {
      window.removeEventListener('requestUpdated', handleRequestUpdate);
      window.removeEventListener('storage', handleRequestUpdate);
    };
  }, [onRequestUpdated]);
  
  // Handle a request status change
  const handleRequestStatusChange = useCallback((requestId: string, newStatus: RequestStatus) => {
    console.log(`RequestsTabContent: Request ${requestId} status changed to ${newStatus}`);
    
    // Update local state to reflect the change immediately
    setLocalRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    
    // Notify parent of update
    if (onRequestUpdated) {
      onRequestUpdated();
    }
  }, [onRequestUpdated]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <RequestCard
            key={`${request.id}-${request.status}`}
            request={request}
            formatDate={formatDate}
            onClearRequest={onClearRequest}
            onAccept={onAcceptRequest}
            onRequestUpdated={() => handleRequestStatusChange(request.id, request.status)}
          />
        ))
      ) : (
        <Card className="col-span-full p-6 text-center">
          <p className="text-muted-foreground">No {status !== "all" ? status : ""} requests found.</p>
        </Card>
      )}
    </div>
  );
};

export default RequestsTabContent;

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
  // Keep local state to force re-renders when needed
  const [updateCount, setUpdateCount] = useState(0);
  
  // Filter requests based on tab
  const filteredRequests = React.useMemo(() => {
    console.log("Filtering requests for status:", status);
    console.log("Available requests:", requests);
    
    if (status === "all") {
      return requests;
    }
    return requests.filter(request => request.status === status);
  }, [requests, status, updateCount]);
  
  // Log when filtered requests change
  useEffect(() => {
    console.log("Filtered requests updated:", filteredRequests);
  }, [filteredRequests]);
  
  // Listen for global request updates
  useEffect(() => {
    const handleRequestUpdate = () => {
      console.log("RequestsTabContent: Global request update detected");
      setUpdateCount(prev => prev + 1);
    };
    
    window.addEventListener('requestUpdated', handleRequestUpdate);
    window.addEventListener('storage', handleRequestUpdate);
    
    return () => {
      window.removeEventListener('requestUpdated', handleRequestUpdate);
      window.removeEventListener('storage', handleRequestUpdate);
    };
  }, []);
  
  // Force update when a request status changes
  const handleRequestUpdated = useCallback(() => {
    console.log("Request updated callback called");
    setUpdateCount(prev => prev + 1);
    if (onRequestUpdated) {
      onRequestUpdated();
    }
  }, [onRequestUpdated]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            formatDate={formatDate}
            onClearRequest={onClearRequest}
            onAccept={onAcceptRequest}
            onRequestUpdated={handleRequestUpdated}
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

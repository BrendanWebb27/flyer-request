
import React, { useEffect, useState, useMemo } from "react";
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
  // Filter requests based on tab - using useMemo to prevent unnecessary recalculations
  const filteredRequests = useMemo(() => {
    if (status === "all") {
      return [...requests];
    }
    return requests.filter(request => request.status === status);
  }, [requests, status]);
  
  // When component receives new requests, log them but don't cause extra re-renders
  useEffect(() => {
    console.log("RequestsTabContent: Received requests for status:", status);
  }, [requests, status]);
  
  // Handle request acceptance with proper notification
  const handleAcceptRequest = (id: string, data: { estimatedTime: string }) => {
    if (onAcceptRequest) {
      console.log("RequestsTabContent: Handling accept for request:", id);
      onAcceptRequest(id, data);
      
      // Notify parent components about the update
      if (onRequestUpdated) {
        onRequestUpdated();
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <RequestCard
            key={request.id} // Simplified key to prevent unnecessary re-renders
            request={request}
            formatDate={formatDate}
            onClearRequest={onClearRequest}
            onAccept={handleAcceptRequest}
            onRequestUpdated={onRequestUpdated}
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

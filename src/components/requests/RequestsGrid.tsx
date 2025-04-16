
import React, { useMemo } from "react";
import { Request } from "@/types/request";
import RequestCard from "./RequestCard";

interface RequestsGridProps {
  requests: Request[];
  formatDate: (date: string) => string;
  onClearRequest: (id: string) => void;
  onAcceptRequest?: (id: string, data: { estimatedTime: string }) => void;
  onCompleteRequest?: (id: string, note: { text: string, author: string }) => void;
  onRequestUpdated?: () => void;
}

const RequestsGrid: React.FC<RequestsGridProps> = ({
  requests,
  formatDate,
  onClearRequest,
  onAcceptRequest,
  onCompleteRequest,
  onRequestUpdated
}) => {
  // Handle request acceptance with proper notification
  const handleAcceptRequest = (id: string, data: { estimatedTime: string }) => {
    if (onAcceptRequest) {
      onAcceptRequest(id, data);
      
      // Notify parent components about the update
      if (onRequestUpdated) {
        setTimeout(() => {
          onRequestUpdated();
        }, 100);
      }
    }
  };
  
  // Handle request completion with proper notification
  const handleCompleteRequest = (id: string, note: { text: string, author: string }) => {
    if (onCompleteRequest) {
      onCompleteRequest(id, note);
      
      // Notify parent components about the update
      if (onRequestUpdated) {
        setTimeout(() => {
          onRequestUpdated();
        }, 100);
      }
    }
  };
  
  // Create a stable key for each request that includes status to force re-render
  const requestsWithKeys = useMemo(() => {
    return requests.map(req => ({
      request: req,
      key: `${req.id}-${req.status}`
    }));
  }, [requests]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requestsWithKeys.map(({ request, key }) => (
        <RequestCard
          key={key}
          request={request}
          formatDate={formatDate}
          onClearRequest={onClearRequest}
          onAccept={handleAcceptRequest}
          onComplete={handleCompleteRequest}
          onRequestUpdated={onRequestUpdated}
        />
      ))}
    </div>
  );
};

export default RequestsGrid;


import React from "react";
import { Request } from "@/types/request";
import RequestCard from "./RequestCard";

interface RequestsGridProps {
  requests: Request[];
  formatDate: (date: string) => string;
  onClearRequest: (id: string) => void;
  onAcceptRequest?: (id: string, data: { estimatedTime: string }) => void;
  onRequestUpdated?: () => void;
}

const RequestsGrid: React.FC<RequestsGridProps> = ({
  requests,
  formatDate,
  onClearRequest,
  onAcceptRequest,
  onRequestUpdated
}) => {
  // Handle request acceptance with proper notification
  const handleAcceptRequest = (id: string, data: { estimatedTime: string }) => {
    if (onAcceptRequest) {
      console.log("RequestsGrid: Handling accept for request:", id);
      onAcceptRequest(id, data);
      
      // Notify parent components about the update
      if (onRequestUpdated) {
        onRequestUpdated();
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          formatDate={formatDate}
          onClearRequest={onClearRequest}
          onAccept={handleAcceptRequest}
          onRequestUpdated={onRequestUpdated}
        />
      ))}
    </div>
  );
};

export default RequestsGrid;

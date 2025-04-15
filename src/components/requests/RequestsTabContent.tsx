
import React from "react";
import { Request, RequestStatus } from "@/components/support/RequestsTable";
import RequestCard from "./RequestCard";

interface RequestsTabContentProps {
  requests: Request[];
  status: RequestStatus | "all";
  formatDate: (dateString: string) => string;
  onClearRequest: (id: string) => void;
  currentUserId: string;
}

export const RequestsTabContent: React.FC<RequestsTabContentProps> = ({
  requests,
  status,
  formatDate,
  onClearRequest,
  currentUserId,
}) => {
  // Filter to just the current user's requests
  const userRequests = requests.filter(request => request.requestedBy === currentUserId);
  
  const filteredRequests = (status: RequestStatus | "all") => {
    if (status === "all") return userRequests;
    return userRequests.filter(request => request.status === status);
  };

  const displayRequests = filteredRequests(status);

  if (displayRequests.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-muted-foreground">No {status === "all" ? "" : status} requests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayRequests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          formatDate={formatDate}
          onClearRequest={onClearRequest}
        />
      ))}
    </div>
  );
};

export default RequestsTabContent;

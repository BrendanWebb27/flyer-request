
import React, { useEffect, useMemo } from "react";
import { RequestStatus, Request } from "@/types/request";
import RequestsGrid from "./RequestsGrid";
import EmptyRequestsState from "./EmptyRequestsState";

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
    console.log(`RequestsTabContent: Filtering requests for status: ${status}`, requests);
    if (status === "all") {
      return [...requests];
    }
    return requests.filter(request => request.status === status);
  }, [requests, status]);
  
  // Log requests when component receives new data
  useEffect(() => {
    console.log(`RequestsTabContent: Received ${filteredRequests.length} requests for status: ${status}`);
    console.log(`RequestsTabContent: Filtered requests:`, filteredRequests);
  }, [filteredRequests, status]);

  // Generate a unique key for the grid to force re-render
  const requestsKey = useMemo(() => {
    return `requests-${status}-${filteredRequests.length}-${Date.now()}`;
  }, [status, filteredRequests]);

  return (
    <>
      {filteredRequests.length > 0 ? (
        <RequestsGrid
          key={requestsKey}
          requests={filteredRequests}
          formatDate={formatDate}
          onClearRequest={onClearRequest}
          onAcceptRequest={onAcceptRequest}
          onRequestUpdated={onRequestUpdated}
        />
      ) : (
        <EmptyRequestsState status={status} />
      )}
    </>
  );
};

export default RequestsTabContent;


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
  onCompleteRequest?: (id: string, note: { text: string, author: string }) => void;
  onRequestUpdated?: () => void; // Callback to notify parent of updates
}

const RequestsTabContent: React.FC<RequestsTabContentProps> = ({
  requests,
  status,
  formatDate,
  onClearRequest,
  currentUserId,
  onAcceptRequest,
  onCompleteRequest,
  onRequestUpdated
}) => {
  // Filter requests based on tab - using useMemo to prevent unnecessary recalculations
  const filteredRequests = useMemo(() => {
    console.log(`RequestsTabContent: Filtering ${requests.length} requests for status: ${status}`);
    
    // Log each request for debugging
    requests.forEach(req => {
      console.log(`Request ${req.id}: status=${req.status}, requestedBy=${req.requestedBy}, currentUser=${currentUserId}`);
    });
    
    if (status === "all") {
      return [...requests];
    }
    return requests.filter(request => request.status === status);
  }, [requests, status, currentUserId]);
  
  // Log requests when component receives new data
  useEffect(() => {
    console.log(`RequestsTabContent: Received ${requests.length} requests in total`);
    console.log(`RequestsTabContent: Filtered to ${filteredRequests.length} requests for status: ${status}`);
  }, [filteredRequests, status, requests.length]);

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
          onCompleteRequest={onCompleteRequest}
          onRequestUpdated={onRequestUpdated}
        />
      ) : (
        <EmptyRequestsState status={status} />
      )}
    </>
  );
};

export default RequestsTabContent;

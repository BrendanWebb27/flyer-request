
import React, { useEffect, useMemo } from "react";
import { RequestStatus, Request } from "@/types/request";
import RequestsGrid from "./RequestsGrid";
import EmptyRequestsState from "./EmptyRequestsState";
import { useProfileAccess } from "@/hooks/useProfileAccess";

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
  const { isSupport } = useProfileAccess();
  
  // Filter requests based on tab and user role - using useMemo to prevent unnecessary recalculations
  const filteredRequests = useMemo(() => {
    console.log(`RequestsTabContent: Filtering ${requests.length} requests for status: ${status}`);
    
    // Filter by status first
    let statusFilteredRequests = status === "all" 
      ? [...requests]
      : requests.filter(request => request.status === status);
    
    // Then by user if not a support user
    if (!isSupport) {
      console.log(`Non-support user filtering: showing only requests for ${currentUserId}`);
      statusFilteredRequests = statusFilteredRequests.filter(request => 
        request.requestedBy === currentUserId
      );
    } else {
      console.log("Support user: showing all requests");
    }
    
    return statusFilteredRequests;
  }, [requests, status, currentUserId, isSupport]);
  
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

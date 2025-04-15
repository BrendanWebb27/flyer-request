
import React, { useCallback } from "react";
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
  onRequestUpdated?: () => void; // New callback to notify parent of updates
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
  // Filter requests based on tab
  const filteredRequests = React.useMemo(() => {
    if (status === "all") {
      return requests;
    }
    return requests.filter(request => request.status === status);
  }, [requests, status]);
  
  // Force update when a request status changes
  const handleRequestUpdated = useCallback(() => {
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

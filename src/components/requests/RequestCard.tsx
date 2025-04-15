
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Request } from "@/types/request";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestMetadata from "./RequestMetadata";
import RequestActions from "./RequestActions";
import RequestNotes from "./RequestNotes";

interface RequestCardProps {
  request: Request;
  formatDate: (dateString: string) => string;
  onClearRequest: (id: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  formatDate, 
  onClearRequest 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <RequestStatusBadge status={request.status} />
              <span className="text-sm font-medium text-muted-foreground">
                {request.id}
              </span>
            </div>
            
            <RequestMetadata 
              location={request.location}
              details={request.details}
              createdAt={request.createdAt}
              formatDate={formatDate}
              assignedTo={request.assignedTo}
              estimatedArrival={request.estimatedArrival}
              requestedBy={request.requestedBy}
              completedAt={request.completedAt}
            />

            <RequestNotes 
              notes={request.notes} 
              formatDate={formatDate} 
            />
          </div>
          
          <RequestActions 
            requestId={request.id} 
            onClear={onClearRequest}
            request={request}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;


import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestMetadata from "./RequestMetadata";
import RequestNotes from "./RequestNotes";
import { Request } from "@/types/request";
import RequestActions from "./RequestActions";

interface RequestCardProps {
  request: Request;
  formatDate: (date: string) => string;
  onClearRequest: (id: string) => void;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  onRequestUpdated?: () => void; // Callback to trigger UI updates
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  formatDate, 
  onClearRequest, 
  onAccept,
  onComplete,
  onRequestUpdated
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">Request {request.id}</CardTitle>
          <p className="text-sm text-gray-500">{request.location}</p>
        </div>
        <RequestStatusBadge status={request.status} />
      </CardHeader>
      <CardContent className="flex-grow">
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
        <p className="mt-3 text-gray-700">{request.details}</p>
        <RequestNotes 
          notes={request.notes} 
          formatDate={formatDate}
        />
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end w-full">
        <RequestActions 
          requestId={request.id}
          onClear={onClearRequest}
          request={request}
          onAccept={onAccept}
          onComplete={onComplete}
          onRequestUpdated={onRequestUpdated}
        />
      </CardFooter>
    </Card>
  );
};

export default RequestCard;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Request } from "@/types/request";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestMetadata from "./RequestMetadata";
import RequestActions from "./RequestActions";

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

            {request.notes && request.notes.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {request.notes.slice(0, 2).map((note, index) => (
                    <div key={index} className="bg-muted p-2 rounded-md">
                      <p className="text-sm">{note.text}</p>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{note.author}</span>
                        <span>{formatDate(note.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                  {request.notes.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{request.notes.length - 2} more notes
                    </p>
                  )}
                </div>
              </div>
            )}
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

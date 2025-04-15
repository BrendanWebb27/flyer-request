
import React from "react";
import { Request } from "@/types/request";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestDetailsItem from "./RequestDetailsItem";
import RequestDetailsNotes from "./RequestDetailsNotes";

interface RequestDetailsDialogProps {
  request: Request;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ request }) => {
  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Request {request.id}</DialogTitle>
          <RequestStatusBadge status={request.status} />
        </div>
        <DialogDescription>
          Created on {new Date(request.createdAt).toLocaleString()}
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <RequestDetailsItem label="Location">
          {request.location}
        </RequestDetailsItem>
        
        <RequestDetailsItem label="Details">
          {request.details}
        </RequestDetailsItem>
        
        <RequestDetailsItem label="Requested By">
          {request.requestedBy}
        </RequestDetailsItem>
        
        {request.assignedTo && (
          <RequestDetailsItem label="Assigned To">
            {request.assignedTo}
          </RequestDetailsItem>
        )}
        
        {request.estimatedArrival && (
          <RequestDetailsItem label="Estimated Arrival">
            {request.estimatedArrival}
          </RequestDetailsItem>
        )}
        
        {request.completedAt && (
          <RequestDetailsItem label="Completed At">
            {new Date(request.completedAt).toLocaleString()}
          </RequestDetailsItem>
        )}
        
        <RequestDetailsNotes notes={request.notes} />
      </div>
    </>
  );
};

export default RequestDetailsDialog;

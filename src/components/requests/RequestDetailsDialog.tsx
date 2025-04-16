
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Request } from "@/types/request";
import RequestDetailsSection from "./RequestDetailsSection";
import AcceptRequestSection from "./AcceptRequestSection";
import CompleteRequestSection from "./CompleteRequestSection";

interface RequestDetailsDialogProps {
  request: Request;
  onClose: () => void;
  onAccept?: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  highlightAccept?: boolean; // Prop to determine if we should highlight accept functionality
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ 
  request, 
  onClose, 
  onAccept,
  onComplete,
  highlightAccept = false
}) => {
  // Determine status to show acceptance or completion options
  const isPending = request.status === "pending";
  const isActive = request.status === "active";

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Request {request.id}</DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        {/* Main request details */}
        <RequestDetailsSection request={request} />
        
        {/* Accept action - only for support staff */}
        {isPending && onAccept && (
          <AcceptRequestSection 
            requestId={request.id}
            onAccept={onAccept}
            highlightAccept={highlightAccept}
          />
        )}
        
        {/* Complete action - only for support staff */}
        {isActive && onComplete && (
          <CompleteRequestSection 
            requestId={request.id}
            onComplete={onComplete}
          />
        )}
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default RequestDetailsDialog;


import React, { useState } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import ClearRequestAlert from "./ClearRequestAlert";
import RequestDetailsButton from "./RequestDetailsButton";
import CompleteRequestButton from "./CompleteRequestButton";

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
  request?: Request;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  onRequestUpdated?: () => void;  // Callback to trigger parent updates
}

export const RequestActions: React.FC<RequestActionsProps> = ({ 
  requestId, 
  onClear, 
  request,
  onAccept,
  onComplete,
  onRequestUpdated
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  const { isSupport } = useProfileAccess();
  
  // Prevent auto-closing of dialogs by stopping propagation
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleAccept = (id: string, data: { estimatedTime: string }) => {
    if (onAccept) {
      console.log("RequestActions: Accepting request with ID:", id);
      
      try {
        // First close the dialog to avoid UI glitches
        setDetailsOpen(false);
        
        // Call the accept function immediately
        onAccept(id, data);
        
        // Trigger event to update all components
        window.dispatchEvent(new Event('requestUpdated'));
        
        // Also call the callback directly if available
        if (onRequestUpdated) {
          onRequestUpdated();
        }
        
        toast({
          title: "Request Accepted",
          description: `You'll arrive in ${data.estimatedTime}.`,
        });
      } catch (error) {
        console.error("Error accepting request:", error);
        toast({
          title: "Error",
          description: "Failed to accept request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleComplete = (id: string, note: { text: string, author: string }) => {
    if (onComplete) {
      console.log("RequestActions: Completing request with ID:", id);
      
      try {
        // First close the dialog to avoid UI glitches
        setDetailsOpen(false);
        
        // Call the complete function
        onComplete(id, note);
        
        // Trigger event to update all components
        window.dispatchEvent(new Event('requestUpdated'));
        
        // Also call the callback directly if available
        if (onRequestUpdated) {
          onRequestUpdated();
        }
        
        toast({
          title: "Request Completed",
          description: "The request has been marked as completed.",
        });
      } catch (error) {
        console.error("Error completing request:", error);
        toast({
          title: "Error",
          description: "Failed to complete request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleClearRequest = () => {
    onClear(requestId);
  };

  // Check if the request is active to show complete button directly
  const isActive = request?.status === "active";
  // Only show the complete button if user is support staff
  const canCompleteRequest = isSupport && isActive && onComplete;
  
  // Determine if we should show the clear button
  // Support users can only clear completed requests
  // General users can clear all types of requests
  const showClearButton = !isSupport || 
                          (isSupport && request?.status === "completed");

  return (
    <div className="flex gap-2 self-end md:self-center" onClick={handleDialogClick}>
      {showClearButton && (
        <ClearRequestAlert onClear={handleClearRequest} />
      )}
      
      {canCompleteRequest && (
        <CompleteRequestButton 
          onClick={(e) => {
            e.stopPropagation();
            setDetailsOpen(true);
          }}
        />
      )}
      
      <RequestDetailsButton 
        request={request}
        open={detailsOpen}
        setOpen={setDetailsOpen}
        handleAccept={isSupport ? handleAccept : undefined}
        handleComplete={isSupport ? handleComplete : undefined}
      />
    </div>
  );
};

export default RequestActions;

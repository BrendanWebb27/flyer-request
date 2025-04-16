
import React, { useState } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import ClearRequestAction from "./actions/ClearRequestAction";
import CompleteRequestAction from "./actions/CompleteRequestAction";
import ViewDetailsAction from "./actions/ViewDetailsAction";
import AcceptRequestAction from "./actions/AcceptRequestAction";
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

  // Check if the request is active to show complete button directly
  const isActive = request?.status === "active";
  // Only show the complete button if user is support staff
  const canCompleteRequest = isSupport && isActive && onComplete;
  
  // Determine if we should show the clear button
  // Now all users can clear requests, but for support users, only completed requests can be cleared
  const showClearButton = !isSupport || 
                          (isSupport && request?.status === "completed");

  return (
    <div 
      className="flex gap-2 self-end md:self-center" 
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {/* Clear button */}
      {showClearButton && (
        <ClearRequestAction 
          requestId={requestId} 
          onClear={onClear} 
        />
      )}
      
      {/* Complete button */}
      {canCompleteRequest && (
        <CompleteRequestAction 
          requestId={requestId} 
          onComplete={handleComplete}
        />
      )}
      
      {/* View details button */}
      {request && (
        <ViewDetailsAction 
          request={request} 
          requestId={requestId}
          onAccept={onAccept}
          onComplete={handleComplete}
          setDetailsOpen={setDetailsOpen}
        />
      )}
      
      {/* Hidden button for accept flow */}
      {isSupport && request?.status === "pending" && onAccept && (
        <AcceptRequestAction 
          requestId={requestId} 
          onAccept={handleAccept} 
        />
      )}

      {/* Show the complete button directly in action area */}
      {canCompleteRequest && (
        <CompleteRequestButton 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }} 
        />
      )}
    </div>
  );
};

export default RequestActions;

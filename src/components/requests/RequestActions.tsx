
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
  onRequestUpdated?: () => void;
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
      try {
        setDetailsOpen(false);
        onAccept(id, data);
        window.dispatchEvent(new Event('requestUpdated'));
        
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
      try {
        setDetailsOpen(false);
        onComplete(id, note);
        window.dispatchEvent(new Event('requestUpdated'));
        
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

  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const isActive = request?.status === "active";
  const canCompleteRequest = isSupport && isActive && onComplete;
  const showClearButton = !isSupport || (isSupport && request?.status === "completed");

  return (
    <div 
      className="flex gap-2 justify-end w-full flex-wrap sm:flex-nowrap"
      onClick={stopPropagation}
    >
      {showClearButton && (
        <ClearRequestAction 
          requestId={requestId} 
          onClear={onClear} 
        />
      )}
      
      {canCompleteRequest && (
        <CompleteRequestAction 
          requestId={requestId} 
          onComplete={handleComplete}
        />
      )}
      
      {request && (
        <ViewDetailsAction 
          request={request} 
          requestId={requestId}
          onAccept={onAccept}
          onComplete={handleComplete}
          setDetailsOpen={setDetailsOpen}
        />
      )}
      
      {isSupport && request?.status === "pending" && onAccept && (
        <AcceptRequestAction 
          requestId={requestId} 
          onAccept={handleAccept} 
        />
      )}

      {canCompleteRequest && (
        <CompleteRequestButton 
          onClick={stopPropagation} 
        />
      )}
    </div>
  );
};

export default RequestActions;

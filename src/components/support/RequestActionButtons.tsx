
import React from "react";
import { Request } from "@/types/request";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import AcceptRequestButton from "./buttons/AcceptRequestButton";
import CompleteRequestButton from "./buttons/CompleteRequestButton";
import ClearRequestButton from "./buttons/ClearRequestButton";
import ViewDetailsButton from "./buttons/ViewDetailsButton";

interface RequestActionButtonsProps {
  request: Request;
  requestIndex: number;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  clearRequest?: (id: string) => void;
  undoClearRequest?: (id: string, index: number) => void;
  setActiveRequest: (id: string | null) => void;
  handleClearRequest: () => void;
}

const RequestActionButtons: React.FC<RequestActionButtonsProps> = ({
  request,
  acceptRequest,
  completeRequest,
  addNote,
  setActiveRequest,
  handleClearRequest
}) => {
  const { isSupport } = useProfileAccess();
  
  // Support users should see different buttons based on request status
  const showAcceptButton = isSupport && request.status === "pending";
  const showCompleteButton = isSupport && request.status === "active";
  
  // Simplified clear button logic:
  // 1. Support users can ONLY clear completed requests
  // 2. Non-support users can clear pending or active requests
  const showClearButton = 
    (isSupport && request.status === "completed") ||
    (!isSupport && (request.status === "pending" || request.status === "active"));
    
  // Handler to prevent event bubbling
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveRequest(request.id);
  };

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-end">
      {/* For pending requests, we only show the ViewDetailsButton which now handles both viewing and accepting */}
      {showAcceptButton ? (
        <ViewDetailsButton 
          requestId={request.id}
          request={request}
          onAccept={acceptRequest}
          onComplete={completeRequest}
          onClick={handleDetailClick}
          showAcceptInDetails={true} // New prop to show Accept functionality in details
        />
      ) : (
        <>
          {showCompleteButton && (
            <CompleteRequestButton 
              request={request}
              completeRequest={completeRequest}
              addNote={addNote}
              setActiveRequest={setActiveRequest}
            />
          )}
          
          {showClearButton && (
            <ClearRequestButton 
              requestId={request.id}
              handleClearRequest={handleClearRequest}
            />
          )}
          
          <ViewDetailsButton 
            requestId={request.id}
            request={request}
            onAccept={acceptRequest}
            onComplete={completeRequest}
            onClick={handleDetailClick}
            showAcceptInDetails={false}
          />
        </>
      )}
    </div>
  );
};

export default RequestActionButtons;

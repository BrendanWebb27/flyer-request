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
  const { isSupport, getUserProfile, isGeneralWorkCenter } = useProfileAccess();
  
  // Get user profile to check permissions
  const userProfile = getUserProfile();
  
  // Support users should see different buttons based on request status
  const showAcceptButton = isSupport && request.status === "pending";
  const showCompleteButton = isSupport && request.status === "active";
  
  // Updated clear button logic to align with isGeneralWorkCenter
  const showClearButton = 
    (isSupport && request.status === "completed") ||
    (!isSupport && (request.status === "pending" || request.status === "active"));

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-end">
      {showAcceptButton && (
        <AcceptRequestButton 
          request={request}
          acceptRequest={acceptRequest}
          setActiveRequest={setActiveRequest}
        />
      )}
      
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
        onClick={() => setActiveRequest(request.id)}
      />
    </div>
  );
};

export default RequestActionButtons;

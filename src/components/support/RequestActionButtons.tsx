
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
  const { isSupport, getUserProfile } = useProfileAccess();
  
  // Get user profile to check work center
  const userProfile = getUserProfile();
  const userWorkCenter = userProfile?.workCenter || '';
  
  // Define general work centers that should have clear access
  const generalWorkCenters = ["AVI", "ENG", "WPN", "APG", "E&E"];
  const hasGeneralAccess = generalWorkCenters.includes(userWorkCenter);
  
  // Support users should see different buttons based on request status
  const showAcceptButton = isSupport && request.status === "pending";
  const showCompleteButton = isSupport && request.status === "active";
  
  // General users with appropriate work centers should see Clear button on pending and active requests
  // Support users should NOT see the clear button on pending and active requests
  const showClearButton = 
    (hasGeneralAccess && (request.status === "pending" || request.status === "active")) || 
    (!hasGeneralAccess && !isSupport) ||
    request.status === "completed";

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
      
      {/* View Details always available to all users */}
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

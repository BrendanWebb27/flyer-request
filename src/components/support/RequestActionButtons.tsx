
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
  const { isSupport } = useProfileAccess();
  
  const showClearButton = !isSupport || 
                          (isSupport && request.status === "completed");

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-end">
      {request.status === "pending" && (
        <AcceptRequestButton 
          request={request}
          acceptRequest={acceptRequest}
          setActiveRequest={setActiveRequest}
        />
      )}
      
      {request.status === "active" && (
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
      
      <ViewDetailsButton requestId={request.id} />
    </div>
  );
};

export default RequestActionButtons;

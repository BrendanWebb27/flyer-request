
import React from "react";
import { Request } from "@/types/request";
import CompleteRequestButton from "./CompleteRequestButton";
import ClearRequestButton from "./ClearRequestButton";
import ViewRequestButton from "./ViewRequestButton";

interface RequestButtonGroupProps {
  request: Request;
  requestIndex: number;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  clearRequest?: (id: string) => void;
  setActiveRequest: (id: string | null) => void;
  handleClearRequest: () => void;
  showCompleteButton: boolean;
  showClearButton: boolean;
  isPending: boolean;
}

const RequestButtonGroup: React.FC<RequestButtonGroupProps> = ({
  request,
  acceptRequest,
  completeRequest,
  addNote,
  setActiveRequest,
  handleClearRequest,
  showCompleteButton,
  showClearButton,
  isPending
}) => {
  return (
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
      
      <ViewRequestButton
        request={request}
        onAccept={acceptRequest}
        onComplete={completeRequest}
        setActiveRequest={setActiveRequest}
        isPending={isPending}
      />
    </>
  );
};

export default RequestButtonGroup;


import React from "react";
import { Request } from "@/types/request";
import RequestButtonGroup from "./buttons/RequestButtonGroup";
import { useActionTypeSelector } from "./buttons/ActionTypeSelector";

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
  requestIndex,
  acceptRequest,
  completeRequest,
  addNote,
  clearRequest,
  setActiveRequest,
  handleClearRequest
}) => {
  // Use our selector hook to determine which buttons to display
  const {
    showCompleteButton,
    showClearButton,
    isPending
  } = useActionTypeSelector(request);
  
  // Add a handler to stop event propagation
  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
    
  return (
    <div 
      className="flex items-center gap-2 flex-nowrap justify-end"
      onClick={handleContainerClick}
    >
      <RequestButtonGroup 
        request={request}
        requestIndex={requestIndex}
        acceptRequest={acceptRequest}
        completeRequest={completeRequest}
        addNote={addNote}
        setActiveRequest={setActiveRequest}
        handleClearRequest={handleClearRequest}
        showCompleteButton={showCompleteButton}
        showClearButton={showClearButton}
        isPending={isPending}
      />
    </div>
  );
};

export default RequestActionButtons;


import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Request } from "@/types/request";
import ViewDetailsButton from "./ViewDetailsButton";

interface ViewRequestButtonProps {
  request: Request;
  onAccept?: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  setActiveRequest: (id: string | null) => void;
  isPending: boolean;
}

const ViewRequestButton: React.FC<ViewRequestButtonProps> = ({
  request,
  onAccept,
  onComplete,
  setActiveRequest,
  isPending
}) => {
  // Handler to prevent event bubbling
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveRequest(request.id);
  };

  return (
    <ViewDetailsButton 
      requestId={request.id}
      request={request}
      onAccept={onAccept}
      onComplete={onComplete}
      onClick={handleDetailClick}
      showAcceptInDetails={isPending}
    />
  );
};

export default ViewRequestButton;

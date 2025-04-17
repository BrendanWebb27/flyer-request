
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Request } from "@/types/request";
import RequestDetailsDialog from "@/components/requests/RequestDetailsDialog";
import ActionButtonSheet from "./ActionButtonSheet";

interface ViewDetailsActionProps {
  request: Request;
  requestId: string;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  setDetailsOpen?: (open: boolean) => void;
}

const ViewDetailsAction: React.FC<ViewDetailsActionProps> = ({
  request,
  requestId,
  onAccept,
  onComplete,
  setDetailsOpen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Update parent state if provided
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (setDetailsOpen) {
      setDetailsOpen(open);
    }
  };
  
  // For dialog content clicks, prevent bubbling
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Check if this is a pending request that can be accepted
  const isPendingAndAcceptable = request.status === "pending" && onAccept;
  
  // Enhanced handling for view detail buttons with click propagation prevention
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };
  
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="relative z-10"
      data-prevent-close="true"
    >
      <ActionButtonSheet
        buttonText={isPendingAndAcceptable ? "Accept/Details" : "Details"}
        buttonIcon={<Eye size={16} />}
        buttonVariant={isPendingAndAcceptable ? "default" : "ghost"}
        buttonClass={isPendingAndAcceptable ? "bg-flyerPurple-600 hover:bg-flyerPurple-700 text-white" : ""}
        title={`Request ${requestId} Details`}
        open={isOpen}
        onOpenChange={handleOpenChange}
        onButtonClick={handleButtonClick}
        preventAutoClose={true}
      >
        <div 
          className="p-4"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          data-prevent-close="true"
        >
          <RequestDetailsDialog
            request={request}
            onClose={() => handleOpenChange(false)}
            onAccept={onAccept}
            onComplete={onComplete}
            highlightAccept={isPendingAndAcceptable}
          />
        </div>
      </ActionButtonSheet>
    </div>
  );
};

export default ViewDetailsAction;

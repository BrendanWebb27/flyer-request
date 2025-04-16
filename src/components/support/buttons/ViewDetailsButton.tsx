
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Request } from "@/types/request";
import RequestDetailsDialog from "@/components/requests/RequestDetailsDialog";

interface ViewDetailsButtonProps {
  requestId: string;
  onClick?: () => void;
  request?: Request;
  onAccept?: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  onComplete?: (id: string, note?: { text: string, author: string }) => void;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ 
  requestId,
  onClick,
  request,
  onAccept,
  onComplete
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Stop propagation for all events
  const stopAllEvents = (e: React.UIEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleClick = (e: React.MouseEvent) => {
    stopAllEvents(e);
    
    if (onClick) {
      onClick();
    } else if (request) {
      // If we have request data, open the dialog
      setOpen(true);
    } else {
      // Fallback to navigation if no request data
      navigate(`/request/${requestId}`);
    }
  };
  
  // Enhanced dialog open state control
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Only close if it's an explicit close action
      const activeElement = document.activeElement as HTMLElement;
      
      // Check if clicked element is a dialog close action
      const isDialogCloseAction = 
        activeElement?.hasAttribute('data-dialog-close') || 
        activeElement?.closest('[data-dialog-close="true"]') ||
        activeElement?.getAttribute('role') === 'button' && 
        !activeElement?.closest('[data-prevent-close="true"]');
        
      if (isDialogCloseAction) {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        className="whitespace-nowrap flex-shrink-0"
        onClick={handleClick}
      >
        <Eye size={16} className="mr-1" />
        Details
      </Button>

      {/* Only render dialog if we have request data */}
      {request && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent 
            className="max-h-[80vh] overflow-y-auto"
            // Prevent dialog from closing when clicking inside it
            onClick={stopAllEvents}
            onMouseDown={stopAllEvents}
            onPointerDown={stopAllEvents}
            onPointerDownOutside={e => {
              // Prevent closing when clicking inside elements with data-prevent-close attribute
              e.preventDefault();
            }}
            onEscapeKeyDown={e => e.preventDefault()}
            onInteractOutside={e => e.preventDefault()}
            data-prevent-close="true"
          >
            <RequestDetailsDialog 
              request={request}
              onClose={() => setOpen(false)}
              onAccept={onAccept}
              onComplete={onComplete}
              data-prevent-close="true"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewDetailsButton;

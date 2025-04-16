
import React from "react";
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
  const [open, setOpen] = React.useState(false);
  
  // All users should have access to view details, so no permission check needed here
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
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
      const target = document.activeElement as HTMLElement;
      
      // Check if clicked element is a dialog close action or outside the dialog
      const isDialogCloseAction = 
        target?.closest('[data-dialog-close="true"]') || 
        target?.getAttribute('role') === 'button' ||
        !target?.closest('[role="dialog"]');
        
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
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerDownOutside={e => {
              // Prevent closing when clicking inside elements with data-prevent-close attribute
              if (e.target && (e.target as Element).closest('[data-prevent-close="true"]')) {
                e.preventDefault();
              }
            }}
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

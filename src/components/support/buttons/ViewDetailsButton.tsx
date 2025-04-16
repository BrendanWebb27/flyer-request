
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Request } from "@/types/request";
import RequestDetailsDialog from "@/components/requests/RequestDetailsDialog";

interface ViewDetailsButtonProps {
  requestId: string;
  onClick?: (e?: React.MouseEvent) => void;  // Make event parameter optional
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
  
  const handleClick = (e: React.MouseEvent) => {
    // Stop event propagation to prevent parent handlers from triggering
    e.stopPropagation();
    e.preventDefault();
    
    console.log("Details button clicked for request:", requestId);
    
    // If we have request data, simply open the dialog
    if (request) {
      setOpen(true);
      return;
    }
    
    // If we have a direct handler, use it
    if (onClick) {
      onClick(e);  // Pass the event to the handler, now optional
      return;
    }
    
    // Fallback to navigation
    navigate(`/request/${requestId}`);
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
        <Dialog 
          open={open} 
          onOpenChange={setOpen}
        >
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <RequestDetailsDialog 
              request={request}
              onClose={() => setOpen(false)}
              onAccept={onAccept}
              onComplete={onComplete}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ViewDetailsButton;

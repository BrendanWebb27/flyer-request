
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  
  // Handle button click with propagation control
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent 
            className="max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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

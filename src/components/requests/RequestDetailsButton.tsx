
import React, { useRef } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Request } from "@/types/request";
import RequestDetailsDialog from "./RequestDetailsDialog";

interface RequestDetailsButtonProps {
  request?: Request;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAccept?: (id: string, data: { estimatedTime: string }) => void;
  handleComplete?: (id: string, note: { text: string, author: string }) => void;
}

const RequestDetailsButton: React.FC<RequestDetailsButtonProps> = ({
  request,
  open,
  setOpen,
  handleAccept,
  handleComplete
}) => {
  const dialogActionRef = useRef<HTMLButtonElement>(null);
  
  // Enhanced handler to properly manage dialog clicks
  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent all default behavior and propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Set dialog state to open
    setOpen(true);
  };
  
  // Handler for clicks inside the dialog to prevent propagation
  const handleDialogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Only close dialog when explicitly requested
  const handleCloseDialog = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
          ref={dialogActionRef}
          onClick={handleButtonClick}
        >
          <Eye size={16} className="mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-md max-h-[80vh] overflow-y-auto" 
        onClick={handleDialogClick}
      >
        {request ? (
          <RequestDetailsDialog 
            request={request} 
            onAccept={handleAccept}
            onComplete={handleComplete}
            onClose={handleCloseDialog}
          />
        ) : (
          <div className="py-8 text-center">
            <p>Request details not available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsButton;

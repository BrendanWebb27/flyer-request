
import React, { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Request } from "@/types/request";
import RequestDetailsDialog from "./RequestDetailsDialog";
import { useNavigate } from "react-router-dom";

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
  request?: Request;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onRequestUpdated?: () => void;  // Callback to trigger parent updates
}

export const RequestActions: React.FC<RequestActionsProps> = ({ 
  requestId, 
  onClear, 
  request,
  onAccept,
  onRequestUpdated
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleAccept = (id: string, data: { estimatedTime: string }) => {
    if (onAccept) {
      console.log("RequestActions: Accepting request with ID:", id);
      onAccept(id, data);
      
      // Close dialog immediately
      setOpen(false);
      
      // Force UI refresh with multiple approaches
      setTimeout(() => {
        console.log("RequestActions: Navigating to active tab");
        
        // Navigate to active tab
        navigate("/active?status=active");
        
        // Also trigger parent component's update callback
        if (onRequestUpdated) {
          console.log("RequestActions: Calling onRequestUpdated callback");
          onRequestUpdated();
        }
        
        // Dispatch a global event as another way to trigger updates
        window.dispatchEvent(new Event('storage'));
      }, 100);
    }
  };

  return (
    <div className="flex gap-2 self-end md:self-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Clear
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear this request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the request from your view. You can undo this action for a short time after clearing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onClear(requestId)}>
              Clear Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
          >
            <Eye size={16} className="mr-1" />
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {request ? (
            <RequestDetailsDialog 
              request={request} 
              onAccept={handleAccept}
              onClose={() => setOpen(false)}
            />
          ) : (
            <div className="py-8 text-center">
              <p>Request details not available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestActions;

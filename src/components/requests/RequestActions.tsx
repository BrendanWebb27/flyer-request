
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

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
  request?: Request;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onRequestUpdated?: () => void;  // New callback to trigger parent updates
}

export const RequestActions: React.FC<RequestActionsProps> = ({ 
  requestId, 
  onClear, 
  request,
  onAccept,
  onRequestUpdated
}) => {
  const [open, setOpen] = useState(false);
  
  const handleAccept = (id: string, data: { estimatedTime: string }) => {
    if (onAccept) {
      onAccept(id, data);
      setOpen(false); // Close dialog after accepting
      
      // Trigger parent update after accepting
      if (onRequestUpdated) {
        setTimeout(() => onRequestUpdated(), 100); // Small timeout to ensure state updates
      }
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

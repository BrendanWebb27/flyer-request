
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const handleAccept = (id: string, data: { estimatedTime: string }) => {
    if (onAccept) {
      console.log("RequestActions: Accepting request with ID:", id);
      
      // Call the accept function
      onAccept(id, data);
      
      // Close dialog immediately
      setOpen(false);
      
      // Show toast to confirm action
      toast({
        title: "Request Accepted",
        description: `You'll arrive in ${data.estimatedTime}.`,
      });
      
      // Trigger storage events to update all components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('requestUpdated'));
      
      // Also call the callback directly if available
      if (onRequestUpdated) {
        onRequestUpdated();
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

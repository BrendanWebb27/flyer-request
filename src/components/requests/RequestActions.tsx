
import React, { useState } from "react";
import { Trash2, Eye, Check } from "lucide-react";
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
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
  request?: Request;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  onRequestUpdated?: () => void;  // Callback to trigger parent updates
}

export const RequestActions: React.FC<RequestActionsProps> = ({ 
  requestId, 
  onClear, 
  request,
  onAccept,
  onComplete,
  onRequestUpdated
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { isSupport } = useProfileAccess();
  
  const handleAccept = (id: string, data: { estimatedTime: string }) => {
    if (onAccept) {
      console.log("RequestActions: Accepting request with ID:", id);
      
      try {
        // First close the dialog to avoid UI glitches
        setOpen(false);
        
        // Call the accept function immediately
        onAccept(id, data);
        
        // Trigger event to update all components
        window.dispatchEvent(new Event('requestUpdated'));
        
        // Also call the callback directly if available
        if (onRequestUpdated) {
          onRequestUpdated();
        }
        
        toast({
          title: "Request Accepted",
          description: `You'll arrive in ${data.estimatedTime}.`,
        });
      } catch (error) {
        console.error("Error accepting request:", error);
        toast({
          title: "Error",
          description: "Failed to accept request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleComplete = (id: string, note: { text: string, author: string }) => {
    if (onComplete) {
      console.log("RequestActions: Completing request with ID:", id);
      
      try {
        // First close the dialog to avoid UI glitches
        setOpen(false);
        
        // Call the complete function
        onComplete(id, note);
        
        // Trigger event to update all components
        window.dispatchEvent(new Event('requestUpdated'));
        
        // Also call the callback directly if available
        if (onRequestUpdated) {
          onRequestUpdated();
        }
        
        toast({
          title: "Request Completed",
          description: "The request has been marked as completed.",
        });
      } catch (error) {
        console.error("Error completing request:", error);
        toast({
          title: "Error",
          description: "Failed to complete request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Check if the request is active to show complete button directly
  const isActive = request?.status === "active";

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
      
      {isActive && onComplete && (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setOpen(true)}
        >
          <Check size={16} className="mr-1" />
          Complete
        </Button>
      )}
      
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
              onAccept={isSupport ? handleAccept : undefined}
              onComplete={handleComplete}
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

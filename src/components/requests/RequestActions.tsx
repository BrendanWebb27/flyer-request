
import React from "react";
import { Trash2 } from "lucide-react";
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

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
}

export const RequestActions: React.FC<RequestActionsProps> = ({ requestId, onClear }) => {
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
      
      <Button 
        size="sm" 
        className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
      >
        View Details
      </Button>
    </div>
  );
};

export default RequestActions;

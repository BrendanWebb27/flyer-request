
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
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

interface ClearRequestButtonProps {
  requestId: string;
  handleClearRequest: () => void;
}

const ClearRequestButton: React.FC<ClearRequestButtonProps> = ({
  requestId,
  handleClearRequest
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          width="auto"
          className="text-red-500 border-red-200 hover:bg-red-50 whitespace-nowrap"
        >
          <Trash2 size={16} className="mr-1" />
          Clear
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear this request?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove request {requestId} from your view. You'll have the option to undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearRequest}>
            <Check size={16} className="mr-1" />
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearRequestButton;

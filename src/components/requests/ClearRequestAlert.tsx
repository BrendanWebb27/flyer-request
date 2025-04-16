
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ClearRequestAlertProps {
  onClear: () => void;
}

const ClearRequestAlert: React.FC<ClearRequestAlertProps> = ({ onClear }) => {
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 border-red-200 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault(); // Add preventDefault to ensure no navigation occurs
          }}
        >
          <Trash2 size={16} />
          Clear
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={handleDialogClick}>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear this request?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the request from your view. You can undo this action for a short time after clearing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClear();
          }}>
            Clear Request
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearRequestAlert;

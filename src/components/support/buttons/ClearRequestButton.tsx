
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface ClearRequestButtonProps {
  requestId: string;
  handleClearRequest: () => void;
}

const ClearRequestButton: React.FC<ClearRequestButtonProps> = ({
  requestId,
  handleClearRequest
}) => {
  const { isSupport } = useProfileAccess();
  const [open, setOpen] = React.useState(false);
  
  // Determine button style based on user role
  const buttonStyle = isSupport 
    ? "text-red-500 border-red-200 hover:bg-red-50" 
    : "text-gray-500 border-gray-200 hover:bg-gray-50";

  // Stop all events from propagating
  const stopAllEvents = (e: React.UIEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Enhanced handling for confirm dialog actions
  const handleConfirmClear = (e: React.MouseEvent) => {
    // Prevent event from propagating and causing side effects
    stopAllEvents(e);
    
    handleClearRequest();
    setOpen(false);
  };

  // Enhanced dialog open state control
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Allow closing when the user explicitly closes the dialog
      const activeElement = document.activeElement as HTMLElement;
      
      // Check if it's a dialog close action
      const isDialogCloseAction = 
        activeElement?.hasAttribute('data-dialog-close') || 
        activeElement?.closest('[data-dialog-close="true"]');
        
      if (isDialogCloseAction) {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`whitespace-nowrap flex-shrink-0 ${buttonStyle}`}
          onClick={(e) => {
            stopAllEvents(e);
            setOpen(true);
          }}
        >
          <Trash2 size={16} className="mr-1" />
          Clear
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={stopAllEvents}
        onMouseDown={stopAllEvents}
        onPointerDown={stopAllEvents}
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
        data-prevent-close="true"
      >
        <DialogHeader>
          <DialogTitle>Clear this request?</DialogTitle>
          <DialogDescription>
            This will remove request {requestId} from your view. You'll have the option to undo this action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={(e) => {
              stopAllEvents(e);
              setOpen(false);
            }}
            data-dialog-close="true"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmClear}
            data-dialog-close="true"
          >
            <Check size={16} className="mr-1" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearRequestButton;

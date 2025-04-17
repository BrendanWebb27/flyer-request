
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Undo } from "lucide-react";
import ActionButtonSheet from "./ActionButtonSheet";
import { SheetClose } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface ClearRequestActionProps {
  requestId: string;
  onClear: (id: string) => void;
  requestStatus?: string;
}

const ClearRequestAction: React.FC<ClearRequestActionProps> = ({ 
  requestId, 
  onClear,
  requestStatus = "unknown" 
}) => {
  const { toast } = useToast();
  const { isSupport } = useProfileAccess();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Check if user should see the clear button based on role and request status
  const shouldShowClearButton = () => {
    if (isSupport) {
      // Support users can only clear completed requests
      return requestStatus === "completed";
    } else {
      // Non-support users can clear pending and active requests
      return requestStatus === "pending" || requestStatus === "active";
    }
  };
  
  // If the user shouldn't see this button, don't render it
  if (!shouldShowClearButton()) {
    return null;
  }
  
  const stopAllEvents = (e: React.UIEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleClearRequest = (e: React.MouseEvent) => {
    stopAllEvents(e);
    
    onClear(requestId);
    setIsOpen(false);
    
    // Add an undo option to the toast
    toast({
      title: "Request Cleared",
      description: `Request ${requestId} has been removed from your view.`,
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          className="border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => {
            // This relies on the existing undoClearRequest method in useSupportRequests hook
            window.dispatchEvent(new CustomEvent('undoClearRequest', {
              detail: { id: requestId }
            }));
          }}
        >
          <Undo size={16} className="mr-1" />
          Undo
        </Button>
      ),
    });
  };

  // Enhanced handling for sheets
  const handleButtonClick = (e: React.MouseEvent) => {
    stopAllEvents(e);
    setIsOpen(true);
  };

  return (
    <div 
      onClick={stopAllEvents}
      onMouseDown={stopAllEvents}
      onPointerDown={stopAllEvents}
      className="relative z-10"
      data-prevent-close="true"
    >
      <ActionButtonSheet
        buttonText="Clear"
        buttonIcon={<Trash2 size={16} />}
        buttonVariant="outline"
        buttonClass="text-red-500 border-red-200 hover:bg-red-50"
        title={`Clear Request ${requestId}`}
        open={isOpen}
        onOpenChange={setIsOpen}
        onButtonClick={handleButtonClick}
        preventAutoClose={true}
      >
        <div 
          className="p-4" 
          onClick={stopAllEvents}
          onMouseDown={stopAllEvents}
          onPointerDown={stopAllEvents}
          data-prevent-close="true"
        >
          <p className="mb-6">Are you sure you want to clear this request? This will remove it from your view.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={(e) => {
                stopAllEvents(e);
                setIsOpen(false);
              }}
              data-explicit-close="true"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={(e) => handleClearRequest(e)}
              data-explicit-close="true"
            >
              Clear Request
            </Button>
          </div>
        </div>
      </ActionButtonSheet>
    </div>
  );
};

export default ClearRequestAction;


import React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import RequestActionPanel from "@/components/RequestActionPanel";

interface AcceptRequestActionProps {
  requestId: string;
  onAccept: (id: string, data: { estimatedTime: string }) => void;
}

const AcceptRequestAction: React.FC<AcceptRequestActionProps> = ({ 
  requestId, 
  onAccept 
}) => {
  // State to control the sheet visibility
  const [open, setOpen] = React.useState(false);
  
  // Handle any external close attempts
  const handleOpenChange = (newOpen: boolean) => {
    // If trying to close without explicit action, prevent it
    if (!newOpen && open) {
      // Check if this was triggered by an explicit close button
      const activeElement = document.activeElement as HTMLElement;
      const isExplicitClose = 
        activeElement?.hasAttribute('data-explicit-close') || 
        activeElement?.closest('[data-explicit-close="true"]');
      
      if (!isExplicitClose) {
        return; // Prevent automatic closing
      }
    }
    
    setOpen(newOpen);
  };
  
  // Stop event propagation to prevent unwanted closures
  const stopPropagation = (e: React.UIEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <Sheet 
      modal={true} 
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SheetTrigger asChild>
        <Button
          id="acceptRequestButton"
          className="hidden"
          onClick={() => setOpen(true)}
        >
          Hidden Accept
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="overflow-y-auto"
        onClick={stopPropagation}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Accept Request {requestId}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <RequestActionPanel 
            requestId={requestId} 
            onAccept={(data) => {
              onAccept(requestId, data);
              setOpen(false);
            }} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AcceptRequestAction;


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
  
  return (
    <Sheet 
      modal={true} 
      open={open}
      onOpenChange={setOpen}
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
      <SheetContent>
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

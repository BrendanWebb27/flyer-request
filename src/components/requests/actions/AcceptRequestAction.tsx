
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
  return (
    <Sheet modal={true}>
      <SheetTrigger asChild>
        <Button
          id="acceptRequestButton"
          className="hidden"
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
            onAccept={(data) => onAccept(requestId, data)} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AcceptRequestAction;

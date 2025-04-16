
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Request } from "@/types/request";
import RequestActionPanel from "@/components/RequestActionPanel";

interface AcceptRequestButtonProps {
  request: Request;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  setActiveRequest: (id: string | null) => void;
}

const AcceptRequestButton: React.FC<AcceptRequestButtonProps> = ({
  request,
  acceptRequest,
  setActiveRequest
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          width="auto"
          className="whitespace-nowrap"
        >
          Accept
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Accept Request {request.id}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <RequestActionPanel 
            requestId={request.id} 
            onAccept={(data) => acceptRequest(request.id, data)} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AcceptRequestButton;

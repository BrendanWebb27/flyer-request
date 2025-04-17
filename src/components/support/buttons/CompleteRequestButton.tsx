
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Request } from "@/types/request";
import CompletionForm from "../CompletionForm";

interface CompleteRequestButtonProps {
  request: Request;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  setActiveRequest: (id: string | null) => void;
}

const CompleteRequestButton: React.FC<CompleteRequestButtonProps> = ({
  request,
  completeRequest,
  addNote,
  setActiveRequest
}) => {
  // This handler ensures the click doesn't bubble up and cause parent components to close the menu
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveRequest(request.id);
  };

  return (
    <Sheet>
      <SheetTrigger asChild onClick={handleTriggerClick}>
        <Button 
          variant="outline" 
          size="sm"
          width="auto"
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 whitespace-nowrap"
        >
          Complete
        </Button>
      </SheetTrigger>
      <SheetContent side="right" onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <SheetTitle>Complete Request {request.id}</SheetTitle>
        </SheetHeader>
        <CompletionForm 
          requestId={request.id}
          request={request}
          completeRequest={completeRequest}
          addNote={addNote}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CompleteRequestButton;

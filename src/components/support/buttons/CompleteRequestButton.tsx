
import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);
  
  // Handle button click - set active request and open sheet
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveRequest(request.id);
    setOpen(true);
  };
  
  // Prevent clicks inside content from propagating
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Sheet 
      open={open} 
      onOpenChange={(newOpenState) => {
        // Only allow explicit user actions to close the sheet
        // Don't close on internal component clicks
        if (newOpenState === false && open === true) {
          // This is only when closing the sheet - we don't auto-complete
          console.log("Sheet closing event - manual close");
        }
        setOpen(newOpenState);
      }}
    >
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          width="auto"
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 whitespace-nowrap"
          onClick={handleButtonClick}
        >
          Complete
        </Button>
      </SheetTrigger>
      <SheetContent side="right" onClick={handleContentClick}>
        <SheetHeader>
          <SheetTitle>Complete Request {request.id}</SheetTitle>
        </SheetHeader>
        <CompletionForm 
          requestId={request.id}
          request={request}
          completeRequest={(id, note) => {
            completeRequest(id, note);
            setOpen(false); // Only close when explicitly completing
          }}
          addNote={addNote}
          onCancel={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CompleteRequestButton;

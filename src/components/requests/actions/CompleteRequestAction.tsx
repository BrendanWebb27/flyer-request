
import React, { useState } from "react";
import ActionButtonSheet from "./ActionButtonSheet";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { CheckCircle } from "lucide-react";

interface CompleteRequestActionProps {
  requestId: string;
  onComplete: (id: string, note: { text: string, author: string }) => void;
}

const CompleteRequestAction: React.FC<CompleteRequestActionProps> = ({ 
  requestId, 
  onComplete 
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Define a handler to stop propagation
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleComplete = (e: React.MouseEvent, note: string) => {
    stopPropagation(e);
    onComplete(requestId, { 
      text: note || "Request completed", 
      author: "Support Staff" 
    });
  };

  return (
    <div onClick={stopPropagation}>
      <ActionButtonSheet
        buttonText="Complete"
        buttonIcon={<CheckCircle size={16} />}
        buttonSize="sm"
        buttonVariant="outline"
        buttonClass="text-green-500 border-green-200 hover:bg-green-50"
        title={`Complete Request ${requestId}`}
        onButtonClick={() => setIsSheetOpen(true)}
      >
        <div className="space-y-4" onClick={stopPropagation}>
          <textarea 
            className="w-full p-2 border rounded-md" 
            placeholder="Add completion notes..."
            rows={4}
            id="completionNotes"
            onClick={stopPropagation}
          />
          <Button
            className="w-full"
            onClick={(e) => {
              const notes = document.getElementById('completionNotes') as HTMLTextAreaElement;
              handleComplete(e, notes?.value || "Request completed");
            }}
          >
            <CheckCircle size={16} className="mr-2" />
            Mark as Completed
          </Button>
        </div>
      </ActionButtonSheet>
    </div>
  );
};

export default CompleteRequestAction;

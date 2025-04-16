
import React from "react";
import ActionButtonSheet from "./ActionButtonSheet";
import { Button } from "@/components/ui/button";
import CompleteRequestButton from "../CompleteRequestButton";

interface CompleteRequestActionProps {
  requestId: string;
  onComplete: (id: string, note: { text: string, author: string }) => void;
}

const CompleteRequestAction: React.FC<CompleteRequestActionProps> = ({ 
  requestId, 
  onComplete 
}) => {
  const handleComplete = (note: string) => {
    onComplete(requestId, { 
      text: note || "Request completed", 
      author: "Support Staff" 
    });
  };

  return (
    <ActionButtonSheet
      buttonText=""
      buttonSize="sm"
      buttonClass="bg-green-600 hover:bg-green-700 p-0"
      title={`Complete Request ${requestId}`}
    >
      <div className="space-y-4">
        <textarea 
          className="w-full p-2 border rounded-md" 
          placeholder="Add completion notes..."
          rows={4}
          id="completionNotes"
        />
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            const notes = document.getElementById('completionNotes') as HTMLTextAreaElement;
            handleComplete(notes?.value || "Request completed");
            const sheetClose = document.querySelector('[data-radix-collection-item]');
            if (sheetClose instanceof HTMLElement) sheetClose.click();
          }}
        >
          Mark as Completed
        </Button>
      </div>
    </ActionButtonSheet>
  );
};

export default CompleteRequestAction;

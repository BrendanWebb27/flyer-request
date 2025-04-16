
import React from "react";
import ActionButtonSheet from "./ActionButtonSheet";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { CheckCircle } from "lucide-react";
import CompleteRequestButton from "../CompleteRequestButton";

interface CompleteRequestActionProps {
  requestId: string;
  onComplete: (id: string, note: { text: string, author: string }) => void;
}

const CompleteRequestAction: React.FC<CompleteRequestActionProps> = ({ 
  requestId, 
  onComplete 
}) => {
  const handleComplete = (e: React.MouseEvent, note: string) => {
    e.stopPropagation();
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
      <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
        <textarea 
          className="w-full p-2 border rounded-md" 
          placeholder="Add completion notes..."
          rows={4}
          id="completionNotes"
          onClick={(e) => e.stopPropagation()}
        />
        <SheetClose asChild>
          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              const notes = document.getElementById('completionNotes') as HTMLTextAreaElement;
              handleComplete(e, notes?.value || "Request completed");
            }}
          >
            <CheckCircle size={16} className="mr-2" />
            Mark as Completed
          </Button>
        </SheetClose>
      </div>
    </ActionButtonSheet>
  );
};

export default CompleteRequestAction;

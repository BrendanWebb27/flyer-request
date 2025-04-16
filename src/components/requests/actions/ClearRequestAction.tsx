
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ActionButtonSheet from "./ActionButtonSheet";
import { SheetClose } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

interface ClearRequestActionProps {
  requestId: string;
  onClear: (id: string) => void;
}

const ClearRequestAction: React.FC<ClearRequestActionProps> = ({ requestId, onClear }) => {
  const { toast } = useToast();
  
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleClearRequest = (e: React.MouseEvent) => {
    stopPropagation(e);
    
    onClear(requestId);
    
    toast({
      title: "Request Cleared",
      description: `Request ${requestId} has been removed from your view.`,
    });
  };

  return (
    <div onClick={stopPropagation} onMouseDown={stopPropagation}>
      <ActionButtonSheet
        buttonText="Clear"
        buttonIcon={<Trash2 size={16} />}
        buttonVariant="outline"
        buttonClass="text-red-500 border-red-200 hover:bg-red-50"
        title={`Clear Request ${requestId}`}
      >
        <div className="full-sheet-content" onClick={stopPropagation} onMouseDown={stopPropagation}>
          <p className="mb-4">Are you sure you want to clear this request? This will remove it from your view.</p>
          <div className="flex justify-end gap-2 mt-6">
            <SheetClose asChild data-sheet-close="true">
              <Button 
                variant="outline" 
                onClick={stopPropagation}
                data-sheet-close="true"
              >
                Cancel
              </Button>
            </SheetClose>
            <SheetClose asChild data-sheet-close="true">
              <Button 
                variant="destructive" 
                onClick={(e) => {
                  handleClearRequest(e);
                  // Explicitly add a small delay before closing to ensure action completes
                  setTimeout(() => {}, 100);
                }}
                data-sheet-close="true"
              >
                Clear Request
              </Button>
            </SheetClose>
          </div>
        </div>
      </ActionButtonSheet>
    </div>
  );
};

export default ClearRequestAction;

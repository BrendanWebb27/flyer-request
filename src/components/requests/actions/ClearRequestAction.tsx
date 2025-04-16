
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Undo } from "lucide-react";
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
    
    // Add an undo option to the toast
    toast({
      title: "Request Cleared",
      description: `Request ${requestId} has been removed from your view.`,
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          className="border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => {
            // This relies on the existing undoClearRequest method in useSupportRequests hook
            window.dispatchEvent(new CustomEvent('undoClearRequest', {
              detail: { id: requestId }
            }));
          }}
        >
          <Undo size={16} className="mr-1" />
          Undo
        </Button>
      ),
    });
  };

  return (
    <div 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      data-prevent-close="true"
    >
      <ActionButtonSheet
        buttonText="Clear"
        buttonIcon={<Trash2 size={16} />}
        buttonVariant="outline"
        buttonClass="text-red-500 border-red-200 hover:bg-red-50"
        title={`Clear Request ${requestId}`}
      >
        <div 
          className="p-4" 
          onClick={stopPropagation}
          onMouseDown={stopPropagation}
          data-prevent-close="true"
        >
          <p className="mb-6">Are you sure you want to clear this request? This will remove it from your view.</p>
          <div className="flex justify-end gap-3 mt-6">
            <SheetClose asChild>
              <Button 
                variant="outline" 
                onClick={stopPropagation}
                data-sheet-close="true"
              >
                Cancel
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button 
                variant="destructive" 
                onClick={(e) => {
                  handleClearRequest(e);
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

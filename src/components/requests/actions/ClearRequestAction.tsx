
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ActionButtonSheet from "./ActionButtonSheet";

interface ClearRequestActionProps {
  requestId: string;
  onClear: (id: string) => void;
}

const ClearRequestAction: React.FC<ClearRequestActionProps> = ({ requestId, onClear }) => {
  const handleClearRequest = () => {
    onClear(requestId);
  };

  return (
    <ActionButtonSheet
      buttonText="Clear"
      buttonIcon={<Trash2 size={16} />}
      buttonVariant="outline"
      buttonClass="text-red-500 border-red-200 hover:bg-red-50"
      title={`Clear Request ${requestId}`}
    >
      <div>
        <p className="mb-4">Are you sure you want to clear this request? This will remove it from your view.</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={(e) => {
            e.stopPropagation();
            const sheetClose = document.querySelector('[data-radix-collection-item]');
            if (sheetClose instanceof HTMLElement) sheetClose.click();
          }}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={(e) => {
              e.stopPropagation();
              handleClearRequest();
              const sheetClose = document.querySelector('[data-radix-collection-item]');
              if (sheetClose instanceof HTMLElement) sheetClose.click();
            }}
          >
            Clear Request
          </Button>
        </div>
      </div>
    </ActionButtonSheet>
  );
};

export default ClearRequestAction;

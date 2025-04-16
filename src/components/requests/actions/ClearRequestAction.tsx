
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ActionButtonSheet from "./ActionButtonSheet";
import { SheetClose } from "@/components/ui/sheet";

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
          <SheetClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button 
              variant="destructive" 
              onClick={(e) => {
                e.stopPropagation();
                handleClearRequest();
              }}
            >
              Clear Request
            </Button>
          </SheetClose>
        </div>
      </div>
    </ActionButtonSheet>
  );
};

export default ClearRequestAction;

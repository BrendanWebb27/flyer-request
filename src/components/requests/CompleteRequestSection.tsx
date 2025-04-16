
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface CompleteRequestSectionProps {
  requestId: string;
  onComplete: (id: string, note: { text: string, author: string }) => void;
}

const CompleteRequestSection: React.FC<CompleteRequestSectionProps> = ({ 
  requestId,
  onComplete
}) => {
  const [note, setNote] = useState("");
  
  // Create completion note
  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (note) {
      onComplete(requestId, {
        text: note,
        author: "Support Staff"  // This would be replaced with the actual user
      });
    }
  };
  
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h4 className="font-medium">Complete Request</h4>
      <div className="space-y-2">
        <Label htmlFor="completionNote">Completion Note</Label>
        <Textarea
          id="completionNote"
          placeholder="Add details about the completion..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>
      
      <Button 
        onClick={handleComplete}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={!note}
      >
        <Check size={16} className="mr-2" />
        Mark as Completed
      </Button>
    </div>
  );
};

export default CompleteRequestSection;

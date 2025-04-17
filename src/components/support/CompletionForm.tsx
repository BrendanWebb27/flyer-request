
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Request } from "@/types/request";

interface CompletionFormProps {
  requestId: string;
  request?: Request;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
}

const CompletionForm: React.FC<CompletionFormProps> = ({ 
  requestId, 
  request,
  completeRequest, 
  addNote 
}) => {
  const [completionNote, setCompletionNote] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState<Array<{ text: string }>>([]);
  const [secondUser, setSecondUser] = useState(request?.secondUser || "");
  
  const isToolTurnover = request?.assetType === "tool-turnover";
  
  const addAdditionalNote = (e: React.MouseEvent) => {
    // Prevent default button behavior and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    setAdditionalNotes([...additionalNotes, { text: "" }]);
  };
  
  const updateAdditionalNote = (index: number, text: string) => {
    const updatedNotes = [...additionalNotes];
    updatedNotes[index].text = text;
    setAdditionalNotes(updatedNotes);
  };
  
  const submitAdditionalNotes = (id: string) => {
    if (addNote) {
      additionalNotes.forEach(note => {
        if (note.text.trim()) {
          addNote(id, {
            text: note.text,
            author: "Support Staff" // In a real app, this would be the current user
          });
        }
      });
    }
  };
  
  const handleCompleteWithNote = (id: string, e?: React.MouseEvent) => {
    // Prevent default button behavior and stop propagation if event is provided
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    let noteText = completionNote.trim();
    
    // For tool turnover, include the second user in the completion note
    if (isToolTurnover && secondUser.trim()) {
      noteText = `Tool turnover to: ${secondUser}\n\n${noteText}`;
    }
    
    if (noteText) {
      completeRequest(id, { 
        text: noteText, 
        author: "Support Staff" // In a real app, this would be the current user
      });
    } else {
      completeRequest(id);
    }
    setCompletionNote("");
    setAdditionalNotes([]);
  };

  // Handler to prevent the sheet from closing when content is clicked
  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  return (
    <div className="space-y-4 mt-4" onClick={handleFormClick}>
      {isToolTurnover && (
        <div className="space-y-2">
          <Label htmlFor="secondUser" className="flex items-center gap-2">
            <UsersRound size={16} className="text-flyerPurple-500" />
            Receiving User
          </Label>
          <Input 
            id="secondUser"
            placeholder="Enter receiving user's ID"
            value={secondUser}
            onChange={(e) => setSecondUser(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="completionNote" className="flex items-center gap-2">
          <FileText size={16} className="text-flyerPurple-500" />
          Completion Note
        </Label>
        <Textarea 
          id="completionNote"
          placeholder="What was done to complete this request?"
          value={completionNote}
          onChange={(e) => setCompletionNote(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          rows={4}
        />
      </div>
      
      {additionalNotes.map((note, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={`additionalNote-${index}`}>
            Additional Note {index + 1}
          </Label>
          <Textarea 
            id={`additionalNote-${index}`}
            placeholder="Add more details..."
            value={note.text}
            onChange={(e) => updateAdditionalNote(index, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            rows={3}
          />
        </div>
      ))}
      
      <div className="flex gap-2">
        <Button 
          type="button"
          variant="outline"
          onClick={addAdditionalNote}
        >
          Add Another Note
        </Button>
      </div>
      
      <Button 
        className="w-full"
        onClick={(e) => {
          handleCompleteWithNote(requestId, e);
          submitAdditionalNotes(requestId);
        }}
      >
        Mark as Complete
      </Button>
    </div>
  );
};

export default CompletionForm;

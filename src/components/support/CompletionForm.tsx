
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface CompletionFormProps {
  requestId: string;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
}

const CompletionForm: React.FC<CompletionFormProps> = ({ 
  requestId, 
  completeRequest, 
  addNote 
}) => {
  const [completionNote, setCompletionNote] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState<Array<{ text: string }>>([]);
  
  const addAdditionalNote = () => {
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
  
  const handleCompleteWithNote = (id: string) => {
    if (completionNote.trim()) {
      completeRequest(id, { 
        text: completionNote, 
        author: "Support Staff" // In a real app, this would be the current user
      });
    } else {
      completeRequest(id);
    }
    setCompletionNote("");
    setAdditionalNotes([]);
  };

  return (
    <div className="space-y-4 mt-4">
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
        onClick={() => {
          handleCompleteWithNote(requestId);
          submitAdditionalNotes(requestId);
        }}
      >
        Mark as Complete
      </Button>
    </div>
  );
};

export default CompletionForm;

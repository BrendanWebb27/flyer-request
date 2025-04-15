
import React from "react";
import { Note } from "@/types/request";

interface RequestDetailsNotesProps {
  notes: Note[];
}

const RequestDetailsNotes: React.FC<RequestDetailsNotesProps> = ({ notes }) => {
  if (!notes || notes.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium text-sm text-muted-foreground mb-1">Notes</h3>
      <div className="space-y-2">
        {notes.map((note, index) => (
          <div key={index} className="bg-muted p-3 rounded-md">
            <p className="text-sm">{note.text}</p>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{note.author}</span>
              <span>{new Date(note.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestDetailsNotes;

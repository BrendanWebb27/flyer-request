
import React from "react";
import { Note } from "@/types/request";

interface RequestNotesProps {
  notes: Note[];
  formatDate: (dateString: string) => string;
}

const RequestNotes: React.FC<RequestNotesProps> = ({ notes, formatDate }) => {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes:</h4>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {notes.slice(0, 2).map((note, index) => (
          <div key={index} className="bg-muted p-2 rounded-md">
            <p className="text-sm">{note.text}</p>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{note.author}</span>
              <span>{formatDate(note.timestamp)}</span>
            </div>
          </div>
        ))}
        {notes.length > 2 && (
          <p className="text-xs text-muted-foreground">
            +{notes.length - 2} more notes
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestNotes;

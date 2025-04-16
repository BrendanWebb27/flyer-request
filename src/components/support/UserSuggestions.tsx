
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserSuggestion {
  username: string;
  email: string;
}

interface UserSuggestionsProps {
  suggestions: UserSuggestion[];
  onSelect: (suggestion: UserSuggestion) => void;
}

const UserSuggestions: React.FC<UserSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
      <ScrollArea className="h-full max-h-60">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            <div className="font-medium">{suggestion.username}</div>
            <div className="text-sm text-gray-500">{suggestion.email}</div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default UserSuggestions;


import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompleteRequestButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const CompleteRequestButton: React.FC<CompleteRequestButtonProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };

  return (
    <Button 
      size="sm" 
      variant="outline"
      width="auto"
      className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap flex-shrink-0"
      onClick={handleClick}
    >
      <Check size={16} className="mr-1" />
      Complete
    </Button>
  );
};

export default CompleteRequestButton;

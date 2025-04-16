
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompleteRequestButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const CompleteRequestButton: React.FC<CompleteRequestButtonProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Add preventDefault to ensure no navigation occurs
    onClick(e);
  };

  return (
    <Button 
      size="sm" 
      width="auto"
      className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
      onClick={handleClick}
    >
      <Check size={16} className="mr-1" />
      Complete
    </Button>
  );
};

export default CompleteRequestButton;

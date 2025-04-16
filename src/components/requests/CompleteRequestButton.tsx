
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompleteRequestButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const CompleteRequestButton: React.FC<CompleteRequestButtonProps> = ({ onClick }) => {
  return (
    <Button 
      size="sm" 
      className="bg-green-600 hover:bg-green-700"
      onClick={onClick}
    >
      <Check size={16} className="mr-1" />
      Complete
    </Button>
  );
};

export default CompleteRequestButton;

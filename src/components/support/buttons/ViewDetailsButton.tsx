
import React from "react";
import { Button } from "@/components/ui/button";

interface ViewDetailsButtonProps {
  requestId: string;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      width="auto" 
      className="whitespace-nowrap"
    >
      Details
    </Button>
  );
};

export default ViewDetailsButton;


import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

interface ViewDetailsButtonProps {
  requestId: string;
  onClick?: () => void;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ 
  requestId,
  onClick 
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onClick) {
      onClick();
    } else {
      // If no click handler is provided, navigate to a request details page
      navigate(`/request/${requestId}`);
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm"
      width="auto" 
      className="whitespace-nowrap flex-shrink-0"
      onClick={handleClick}
    >
      <Eye size={16} className="mr-1" />
      Details
    </Button>
  );
};

export default ViewDetailsButton;

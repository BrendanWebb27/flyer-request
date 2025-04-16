
import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ActionButtonSheetProps {
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonClass?: string;
  title: string;
  children: React.ReactNode;
  onButtonClick?: (e: React.MouseEvent) => void;
}

const ActionButtonSheet: React.FC<ActionButtonSheetProps> = ({
  buttonText,
  buttonIcon,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonClass = "",
  title,
  children,
  onButtonClick
}) => {
  const [open, setOpen] = useState(false);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent parent elements from receiving the click
    e.preventDefault();
    e.stopPropagation();
    
    // If there's an additional click handler, call it
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  // Improved sheet opening/closing handling
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    console.log("Sheet open state changed to:", newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button 
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClass}
          onClick={handleButtonClick}
        >
          {buttonIcon && <span className="mr-1">{buttonIcon}</span>}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        onClick={(e) => e.stopPropagation()}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionButtonSheet;

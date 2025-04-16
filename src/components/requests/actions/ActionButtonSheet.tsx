
import React, { useState, useEffect } from "react";
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
  
  // This useEffect helps debug the open state changes
  useEffect(() => {
    console.log("ActionButtonSheet open state changed to:", open);
  }, [open]);

  const handleButtonClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent parent elements from receiving the click
    e.preventDefault();
    e.stopPropagation();
    
    // Set open to true when the button is clicked
    setOpen(true);
    
    // If there's an additional click handler, call it
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  return (
    <Sheet 
      open={open} 
      onOpenChange={setOpen}
      modal={true}
    >
      <SheetTrigger asChild>
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
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside if it's not a button meant to close
          const target = e.target as HTMLElement;
          if (!target.closest('[data-sheet-close="true"]')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Prevent closing when interacting outside if it's not a button meant to close
          const target = e.target as HTMLElement;
          if (!target.closest('[data-sheet-close="true"]')) {
            e.preventDefault();
          }
        }}
        className="overflow-y-auto max-h-screen"
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

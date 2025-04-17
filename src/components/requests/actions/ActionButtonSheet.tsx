
import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ActionButtonSheet: React.FC<ActionButtonSheetProps> = ({
  buttonText,
  buttonIcon,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonClass = "",
  title,
  children,
  onButtonClick,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use either controlled or uncontrolled state
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  
  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent bubbling to avoid triggering parent click handlers
    e.preventDefault();
    e.stopPropagation();
    
    // Update internal state
    if (!isControlled) {
      setInternalOpen(true);
    }
    
    // Call external handlers
    if (onButtonClick) {
      onButtonClick(e);
    }
    
    if (externalOnOpenChange) {
      externalOnOpenChange(true);
    }
  };

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    
    // Call external handler if provided
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
  };
  
  // Add this handler to stop propagation on the sheet content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <SheetTrigger asChild onClick={handleButtonClick}>
        <Button 
          variant={buttonVariant}
          size={buttonSize}
          width="auto"
          className={`whitespace-nowrap flex-shrink-0 ${buttonClass}`}
        >
          {buttonIcon && <span className="mr-1">{buttonIcon}</span>}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="overflow-y-auto max-h-screen"
        onClick={handleContentClick}
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

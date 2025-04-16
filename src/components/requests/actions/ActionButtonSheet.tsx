
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
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setOpen(true);
    
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  // Enhanced handling of sheet open state
  const handleOpenChange = (newOpen: boolean) => {
    // Only allow sheet to be closed when specific close elements are clicked
    if (newOpen === false) {
      // Check if the active element is a close button or has a close attribute
      const target = document.activeElement as HTMLElement;
      
      // Look for elements with data-sheet-close attribute or inside elements with that attribute
      const isCloseAction = 
        target?.hasAttribute('data-sheet-close') || 
        target?.closest('[data-sheet-close="true"]');
      
      // Only allow close if an explicit close action is detected
      if (isCloseAction) {
        setOpen(false);
      }
    } else {
      // Always allow opening
      setOpen(true);
    }
  };

  return (
    <Sheet 
      open={open} 
      onOpenChange={handleOpenChange}
      modal={true}
    >
      <SheetTrigger asChild>
        <Button 
          variant={buttonVariant}
          size={buttonSize}
          width="auto"
          className={`whitespace-nowrap flex-shrink-0 ${buttonClass}`}
          onClick={handleButtonClick}
        >
          {buttonIcon && <span className="mr-1">{buttonIcon}</span>}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="overflow-y-auto max-h-screen"
        // Prevent propagation and closing on all interaction events
        onClick={e => e.stopPropagation()}
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onInteractOutside={e => e.preventDefault()}
        onCloseAutoFocus={e => e.preventDefault()}
        data-prevent-close="true"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div 
          className="mt-4" 
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          data-prevent-close="true"
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionButtonSheet;


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
  
  // Force update when external open state changes
  useEffect(() => {
    if (isControlled) {
      setInternalOpen(externalOpen);
    }
  }, [externalOpen, isControlled]);
  
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
    
    if (externalOnOpenChange && !isControlled) {
      externalOnOpenChange(true);
    }
  };

  // Enhanced handling of sheet open state
  const handleOpenChange = (newOpen: boolean) => {
    // Update internal state if uncontrolled
    if (!isControlled) {
      // When trying to close
      if (!newOpen) {
        // Check if the active element is a close button or has a close attribute
        const activeElement = document.activeElement as HTMLElement;
        
        // Look for elements with data-sheet-close attribute or inside elements with that attribute
        const isCloseAction = 
          activeElement?.hasAttribute('data-sheet-close') || 
          activeElement?.closest('[data-sheet-close="true"]');
        
        // Only allow close if an explicit close action is detected
        if (isCloseAction) {
          setInternalOpen(false);
        } 
      } else {
        // Always allow opening
        setInternalOpen(true);
      }
    }
    
    // Call external handler if provided
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
  };

  return (
    <Sheet 
      open={isOpen} 
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
        onMouseDown={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
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
          onPointerDown={e => e.stopPropagation()}
          data-prevent-close="true"
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionButtonSheet;

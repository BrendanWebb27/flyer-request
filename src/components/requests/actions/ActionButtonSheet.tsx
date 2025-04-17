
import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useProfileAccess } from "@/hooks/useProfileAccess";

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
  preventAutoClose?: boolean;
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
  onOpenChange: externalOnOpenChange,
  preventAutoClose = false
}) => {
  const { isSupport } = useProfileAccess();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Always prevent auto-close for non-support users
  const shouldPreventAutoClose = preventAutoClose || !isSupport;
  
  // Use either controlled or uncontrolled state
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  
  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    // If we want to prevent auto-close and are trying to close without explicit user action
    if (shouldPreventAutoClose && !newOpen && isOpen) {
      // Check if the close was triggered by a click inside the content
      // by looking at the active element and its parents
      const activeElement = document.activeElement as HTMLElement;
      const isExplicitClose = 
        activeElement?.hasAttribute('data-explicit-close') || 
        activeElement?.closest('[data-explicit-close="true"]');
      
      // Only allow closing if it's an explicit close action
      if (!isExplicitClose) {
        return; // Prevent close
      }
    }
    
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    
    // Call external handler if provided
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
  };
  
  // Enhanced handling for content clicks
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handle button click
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call the provided click handler if it exists
    if (onButtonClick) {
      onButtonClick(e);
    } else {
      // If no external handler, toggle the sheet directly
      handleOpenChange(!isOpen);
    }
  };

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <SheetTrigger asChild>
        <Button 
          variant={buttonVariant}
          size={buttonSize}
          className={`whitespace-nowrap flex-shrink-0 ${buttonClass}`}
          onClick={handleClick}
        >
          {buttonIcon && <span className="mr-1">{buttonIcon}</span>}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="overflow-y-auto max-h-screen"
        onClick={handleContentClick}
        onOpenAutoFocus={(e) => shouldPreventAutoClose && e.preventDefault()}
        onPointerDownOutside={(e) => shouldPreventAutoClose && e.preventDefault()}
        onInteractOutside={(e) => shouldPreventAutoClose && e.preventDefault()}
        onEscapeKeyDown={(e) => shouldPreventAutoClose && e.preventDefault()}
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

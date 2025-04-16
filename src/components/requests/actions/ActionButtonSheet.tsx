
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

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Sheet onOpenChange called with:", newOpen);
    // Only allow closing via explicit close button clicks
    if (newOpen === false) {
      // Check if the event was from a proper close button
      const target = document.activeElement as HTMLElement;
      const isCloseAction = target?.hasAttribute('data-sheet-close');
      
      if (isCloseAction) {
        console.log("Closing sheet from close button");
        setOpen(false);
      } else {
        console.log("Preventing automatic sheet close");
        // Prevent automatic closing
        return;
      }
    } else {
      setOpen(true);
    }
  };

  // Prevent propagation for all events inside the sheet
  const stopPropagation = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
          className={buttonClass}
          onClick={handleButtonClick}
        >
          {buttonIcon && <span className="mr-1">{buttonIcon}</span>}
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="overflow-y-auto max-h-screen"
        onClick={stopPropagation}
        onPointerDownOutside={(e) => {
          console.log("Pointer down outside event");
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Prevent escape key from closing the sheet automatically
          console.log("Escape key pressed - preventing default closure");
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          console.log("Interact outside event");
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          // Prevent focus issues that can cause unintended closes
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-4" onClick={stopPropagation}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionButtonSheet;


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
    e.preventDefault();
    e.stopPropagation();
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild onClick={handleTriggerClick}>
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
        onPointerDownOutside={(e) => {
          // Prevent closing on pointer down outside
          e.preventDefault();
        }}
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

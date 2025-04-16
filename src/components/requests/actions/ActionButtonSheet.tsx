
import React from "react";
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
  // Prevent event bubbling to parent elements
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  return (
    <Sheet>
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
      <SheetContent onClick={(e) => e.stopPropagation()} onPointerDownOutside={(e) => e.preventDefault()}>
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

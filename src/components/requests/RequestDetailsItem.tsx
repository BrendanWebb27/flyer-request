
import React from "react";

interface RequestDetailsItemProps {
  label: string;
  value?: string;
  multiline?: boolean;
  children?: React.ReactNode;
}

const RequestDetailsItem: React.FC<RequestDetailsItemProps> = ({ 
  label, 
  value, 
  multiline, 
  children 
}) => {
  // If neither value nor children are provided, don't render anything
  if (!value && !children) return null;
  
  const content = value || children;
  
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-sm text-muted-foreground">{label}</h3>
      <div className={`text-sm font-medium ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {content}
      </div>
    </div>
  );
};

export default RequestDetailsItem;


import React from "react";

interface RequestDetailsItemProps {
  label: string;
  children: React.ReactNode;
}

const RequestDetailsItem: React.FC<RequestDetailsItemProps> = ({ label, children }) => {
  if (!children) return null;
  
  return (
    <div className="space-y-1">
      <h3 className="font-medium text-sm text-muted-foreground">{label}</h3>
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default RequestDetailsItem;

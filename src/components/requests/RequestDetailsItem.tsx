
import React from "react";

interface RequestDetailsItemProps {
  label: string;
  children: React.ReactNode;
}

const RequestDetailsItem: React.FC<RequestDetailsItemProps> = ({ label, children }) => {
  if (!children) return null;
  
  return (
    <div>
      <h3 className="font-medium text-sm text-muted-foreground mb-1">{label}</h3>
      <p>{children}</p>
    </div>
  );
};

export default RequestDetailsItem;

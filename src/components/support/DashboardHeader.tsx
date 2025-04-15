
import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  organization: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  organization, 
  onSignOut 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
        <p className="text-muted-foreground">
          Managing support requests for <span className="font-medium">{organization}</span>
        </p>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSignOut}
      >
        Change Organization
      </Button>
    </div>
  );
};

export default DashboardHeader;

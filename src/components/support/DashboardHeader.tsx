
import React from "react";
import { Mail } from "lucide-react";

interface DashboardHeaderProps {
  organization: string;
  userEmail?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  organization, 
  userEmail
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
        <div className="flex flex-col space-y-1">
          <p className="text-muted-foreground">
            Managing support requests for <span className="font-medium">{organization}</span>
          </p>
          {userEmail && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="mr-1 h-3 w-3" />
              <span>{userEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;

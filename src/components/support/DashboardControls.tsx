
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardControlsProps {
  activeMode: "requests" | "users";
  setActiveMode: (mode: "requests" | "users") => void;
  newRequestCount: number;
  forceSyncRequests: () => void;
  activeTab: string;
  resetNotificationCount: () => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  activeMode,
  setActiveMode,
  newRequestCount,
  forceSyncRequests,
  activeTab,
  resetNotificationCount
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <h2 className="text-2xl font-bold">Support Dashboard</h2>
      
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <Button 
          variant="outline"
          size="sm"
          width="auto"
          onClick={forceSyncRequests}
          className="whitespace-nowrap flex-shrink-0"
        >
          <RefreshCcw size={14} className="mr-2" />
          Sync
        </Button>
        
        {newRequestCount > 0 && activeTab !== "pending" && (
          <Button
            variant="default"
            size="sm"
            width="auto"
            onClick={() => {
              navigate("/support?status=pending");
              resetNotificationCount();
              forceSyncRequests();
            }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 whitespace-nowrap flex-shrink-0"
          >
            <Bell size={14} className="animate-pulse" />
            <Badge variant="secondary" className="bg-white text-amber-700 flex-shrink-0">
              {newRequestCount}
            </Badge>
            <span className="whitespace-nowrap">New {newRequestCount === 1 ? 'Request' : 'Requests'}</span>
          </Button>
        )}
        
        <Tabs value={activeMode} onValueChange={(v) => {
          setActiveMode(v as "requests" | "users");
          forceSyncRequests();
        }}>
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="requests" className="min-w-24 whitespace-nowrap">Support Requests</TabsTrigger>
            <TabsTrigger value="users" className="min-w-24 whitespace-nowrap">User Verification</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardControls;

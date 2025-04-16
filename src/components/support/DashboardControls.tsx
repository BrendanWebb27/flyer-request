
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Bell } from "lucide-react";

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
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Support Dashboard</h2>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline"
          size="sm"
          onClick={forceSyncRequests}
          className="flex items-center gap-1"
        >
          <RefreshCcw size={14} />
          Sync
        </Button>
        
        {newRequestCount > 0 && activeTab !== "pending" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigate("/support?status=pending");
              resetNotificationCount();
              forceSyncRequests();
            }}
            className="flex items-center gap-1 bg-amber-50 border-amber-200 text-amber-700"
          >
            <Bell size={14} />
            {newRequestCount} New {newRequestCount === 1 ? 'Request' : 'Requests'}
          </Button>
        )}
        
        <Tabs value={activeMode} onValueChange={(v) => {
          setActiveMode(v as "requests" | "users");
          forceSyncRequests();
        }}>
          <TabsList>
            <TabsTrigger value="requests">Support Requests</TabsTrigger>
            <TabsTrigger value="users">User Verification</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardControls;

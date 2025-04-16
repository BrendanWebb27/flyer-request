
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Request } from "@/types/request";

interface ActiveRequestsTabsProps {
  availableTabs: string[];
  requests: Request[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ActiveRequestsTabs: React.FC<ActiveRequestsTabsProps> = ({
  availableTabs,
  requests,
  activeTab,
  setActiveTab
}) => {
  return (
    <TabsList className="mb-6">
      {availableTabs.map(tab => (
        <TabsTrigger key={tab} value={tab}>
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {tab !== "all" && requests.filter(r => r.status === tab).length > 0 && (
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              {requests.filter(r => r.status === tab).length}
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default ActiveRequestsTabs;

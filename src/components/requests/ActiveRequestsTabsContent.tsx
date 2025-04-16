
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Request, RequestStatus } from "@/types/request";
import RequestsTabContent from "./RequestsTabContent";

interface ActiveRequestsTabsContentProps {
  availableTabs: string[];
  filteredRequests: Request[];
  formatDate: (date: string) => string;
  onClearRequest: (id: string) => void;
  currentUserId: string;
  onAcceptRequest?: (id: string, data: { estimatedTime: string }) => void;
  onRequestUpdated: () => void;
  refreshCount: number;
}

const ActiveRequestsTabsContent: React.FC<ActiveRequestsTabsContentProps> = ({
  availableTabs,
  filteredRequests,
  formatDate,
  onClearRequest,
  currentUserId,
  onAcceptRequest,
  onRequestUpdated,
  refreshCount
}) => {
  // Using key={refreshCount} to force re-render when requests are updated
  return (
    <div key={`tabs-content-${refreshCount}`}>
      {availableTabs.map((tab) => (
        <TabsContent key={`${tab}-content-${refreshCount}`} value={tab}>
          <RequestsTabContent
            requests={filteredRequests}
            status={tab as RequestStatus | "all"}
            formatDate={formatDate}
            onClearRequest={onClearRequest}
            currentUserId={currentUserId}
            onAcceptRequest={onAcceptRequest}
            onRequestUpdated={onRequestUpdated}
          />
        </TabsContent>
      ))}
    </div>
  );
};

export default ActiveRequestsTabsContent;

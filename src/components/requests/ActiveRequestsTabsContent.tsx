
import React, { useMemo } from "react";
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
  onCompleteRequest?: (id: string, note: { text: string, author: string }) => void;
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
  onCompleteRequest,
  onRequestUpdated,
  refreshCount
}) => {
  console.log("ActiveRequestsTabsContent rendering with refreshCount:", refreshCount);
  
  // Create a stable key for the TabsContent components
  const tabContentKey = useMemo(() => `tabs-content-${refreshCount}-${Date.now()}`, [refreshCount]);
  
  // Check if user is support staff
  const isSupport = localStorage.getItem("supportAccessGranted") === "true";
  
  return (
    <div key={tabContentKey}>
      {availableTabs.map((tab) => (
        <TabsContent 
          key={`${tab}-content-${refreshCount}-${Date.now()}`} 
          value={tab}
        >
          <RequestsTabContent
            requests={filteredRequests}
            status={tab as RequestStatus | "all"}
            formatDate={formatDate}
            onClearRequest={onClearRequest}
            currentUserId={currentUserId}
            onAcceptRequest={isSupport ? onAcceptRequest : undefined}
            onCompleteRequest={isSupport ? onCompleteRequest : undefined}
            onRequestUpdated={onRequestUpdated}
          />
        </TabsContent>
      ))}
    </div>
  );
};

export default ActiveRequestsTabsContent;

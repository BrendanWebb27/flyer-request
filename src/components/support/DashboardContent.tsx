
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import RequestTabs from "@/components/support/RequestTabs";
import RequestsTable from "@/components/support/RequestsTable";
import UserLookup from "@/components/support/UserLookup";
import { Request } from "@/types/request";

interface DashboardContentProps {
  activeMode: "requests" | "users";
  activeTab: string;
  syncTimer: number;
  requests: Request[];
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  clearRequest?: (id: string) => void;
  undoClearRequest?: (id: string, index: number) => void;
  onTabChange: (value: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeMode,
  activeTab,
  syncTimer,
  requests,
  formatDate,
  acceptRequest,
  completeRequest,
  addNote,
  clearRequest,
  undoClearRequest,
  onTabChange
}) => {
  return (
    <>
      {activeMode === "users" ? (
        <UserLookup />
      ) : (
        <RequestTabs defaultValue={activeTab} onTabChange={onTabChange}>
          {["all", "pending", "active", "completed"].map((tab) => (
            <TabsContent key={`${tab}-content-${syncTimer}`} value={tab}>
              <RequestsTable
                requests={requests}
                activeTab={tab}
                formatDate={formatDate}
                acceptRequest={acceptRequest}
                completeRequest={completeRequest}
                addNote={addNote}
                clearRequest={clearRequest}
                undoClearRequest={undoClearRequest}
              />
            </TabsContent>
          ))}
        </RequestTabs>
      )}
    </>
  );
};

export default DashboardContent;

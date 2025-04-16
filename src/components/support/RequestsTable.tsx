
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Request, RequestStatus } from "@/types/request";
import RequestRow from "./RequestRow";
import EmptyTableRow from "./EmptyTableRow";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { resetDemoData } from "@/utils/requestPersistence";
import { useToast } from "@/hooks/use-toast";

interface RequestsTableProps {
  requests: Request[];
  activeTab: string;
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  clearRequest?: (id: string) => void;
  undoClearRequest?: (id: string, index: number) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  activeTab,
  formatDate,
  acceptRequest,
  completeRequest,
  addNote,
  clearRequest,
  undoClearRequest
}) => {
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const { isSupport } = useProfileAccess();
  const { toast } = useToast();

  // Filter requests based on the active tab
  const filteredRequests = React.useMemo(() => {
    if (activeTab === "all") {
      return requests;
    }
    return requests.filter(request => request.status === activeTab as RequestStatus);
  }, [requests, activeTab]);

  const handleResetDemoData = () => {
    resetDemoData();
    toast({
      title: "Demo Data Reset",
      description: "All requests have been reset to the initial demo data.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {activeTab === "all" 
            ? "All Requests" 
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests`}
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetDemoData}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset Demo Data
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Estimated Arrival</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => (
                <RequestRow 
                  key={request.id}
                  request={request}
                  requestIndex={index}
                  formatDate={formatDate}
                  acceptRequest={acceptRequest}
                  completeRequest={completeRequest}
                  addNote={addNote}
                  clearRequest={clearRequest}
                  undoClearRequest={undoClearRequest}
                  setActiveRequest={setActiveRequest}
                />
              ))
            ) : (
              <EmptyTableRow activeTab={activeTab} colSpan={6} />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;

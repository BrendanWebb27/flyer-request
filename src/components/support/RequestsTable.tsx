
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Request } from "@/types/request";
import RequestTableHeader from "./RequestTableHeader";
import RequestRow from "./RequestRow";
import RequestEmptyRow from "./RequestEmptyRow";

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
  const [activeRequest, setActiveRequest] = React.useState<string | null>(null);

  // Filter requests based on the active tab
  const filteredRequests = React.useMemo(() => {
    if (activeTab === "all") {
      return requests;
    } else {
      return requests.filter(request => request.status === activeTab);
    }
  }, [requests, activeTab]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {activeTab === "all" 
            ? "All Requests" 
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <RequestTableHeader />
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
              <RequestEmptyRow activeTab={activeTab} />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;

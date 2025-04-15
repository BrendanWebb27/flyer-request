
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Request, RequestStatus } from "@/types/request";
import RequestRow from "./RequestRow";
import EmptyTableRow from "./EmptyTableRow";

interface RequestsTableProps {
  requests: Request[];
  activeTab: string;
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  activeTab,
  formatDate,
  acceptRequest,
  completeRequest,
  addNote
}) => {
  const [activeRequest, setActiveRequest] = useState<string | null>(null);

  // Filter requests based on the active tab
  const filteredRequests = React.useMemo(() => {
    if (activeTab === "all") {
      return requests;
    }
    return requests.filter(request => request.status === activeTab as RequestStatus);
  }, [requests, activeTab]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {activeTab === "all" 
            ? "All Requests" 
            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests`}
        </CardTitle>
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
              filteredRequests.map((request) => (
                <RequestRow 
                  key={request.id}
                  request={request}
                  formatDate={formatDate}
                  acceptRequest={acceptRequest}
                  completeRequest={completeRequest}
                  addNote={addNote}
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

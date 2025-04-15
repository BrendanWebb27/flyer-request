
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RequestActionPanel from "@/components/RequestActionPanel";

export type RequestStatus = "pending" | "active" | "completed" | "cancelled";

export interface Request {
  id: string;
  location: string;
  details: string;
  createdAt: string;
  status: RequestStatus;
  estimatedDuration: string;
  assignedTo?: string;
  estimatedArrival?: string;
}

interface RequestsTableProps {
  requests: Request[];
  activeTab: string;
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  activeTab,
  formatDate,
  acceptRequest,
  completeRequest
}) => {
  const filteredRequests = (status: RequestStatus | "all") => {
    if (status === "all") return requests;
    return requests.filter(request => request.status === status);
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Est. Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests(activeTab as RequestStatus | "all").length > 0 ? (
              filteredRequests(activeTab as RequestStatus | "all").map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>{request.estimatedDuration}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.status === "pending" && (
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">Accept</Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Accept Request {request.id}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4">
                              <RequestActionPanel 
                                requestId={request.id} 
                                onAccept={(data) => acceptRequest(request.id, data)} 
                              />
                            </div>
                          </SheetContent>
                        </Sheet>
                      )}
                      
                      {request.status === "active" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                          onClick={() => completeRequest(request.id)}
                        >
                          Complete
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No {activeTab === "all" ? "" : activeTab} requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;

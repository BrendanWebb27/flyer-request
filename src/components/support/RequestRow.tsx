
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Request, RequestStatus } from "@/types/request";
import RequestActionPanel from "@/components/RequestActionPanel";
import CompletionForm from "./CompletionForm";

interface RequestRowProps {
  request: Request;
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  setActiveRequest: (id: string | null) => void;
}

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  formatDate,
  acceptRequest,
  completeRequest,
  addNote,
  setActiveRequest,
}) => {
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
    <TableRow key={request.id}>
      <TableCell>{request.id}</TableCell>
      <TableCell>{request.location}</TableCell>
      <TableCell>{formatDate(request.createdAt)}</TableCell>
      <TableCell>{request.estimatedArrival || 'Not specified'}</TableCell>
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
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                  onClick={() => setActiveRequest(request.id)}
                >
                  Complete
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Complete Request {request.id}</SheetTitle>
                </SheetHeader>
                <CompletionForm 
                  requestId={request.id}
                  completeRequest={completeRequest}
                  addNote={addNote}
                />
              </SheetContent>
            </Sheet>
          )}
          
          <Button variant="ghost" size="sm">
            Details
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;

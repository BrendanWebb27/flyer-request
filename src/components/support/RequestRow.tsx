import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Request, RequestStatus } from "@/types/request";
import RequestActionPanel from "@/components/RequestActionPanel";
import CompletionForm from "./CompletionForm";
import { Trash2, Check, Undo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface RequestRowProps {
  request: Request;
  requestIndex: number;
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  clearRequest?: (id: string) => void;
  undoClearRequest?: (id: string, index: number) => void;
  setActiveRequest: (id: string | null) => void;
}

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  requestIndex,
  formatDate,
  acceptRequest,
  completeRequest,
  addNote,
  clearRequest,
  undoClearRequest,
  setActiveRequest,
}) => {
  const { toast } = useToast();
  const [showUndoToast, setShowUndoToast] = useState(false);
  const { isSupport } = useProfileAccess();

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

  const handleClearRequest = () => {
    if (clearRequest) {
      clearRequest(request.id);
      
      toast({
        title: "Request Cleared",
        description: "The request has been removed from your view.",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => {
              if (undoClearRequest) {
                undoClearRequest(request.id, requestIndex);
                setShowUndoToast(false);
              }
            }}
          >
            <Undo size={16} className="mr-1" />
            Undo
          </Button>
        ),
      });
    }
  };

  const showClearButton = !isSupport || 
                          (isSupport && request.status === "completed");

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
                  request={request}
                  completeRequest={completeRequest}
                  addNote={addNote}
                />
              </SheetContent>
            </Sheet>
          )}
          
          {showClearButton && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear this request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove request {request.id} from your view. You'll have the option to undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearRequest}>
                    <Check size={16} className="mr-1" />
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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

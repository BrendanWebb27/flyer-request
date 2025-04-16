
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import RequestActionButtons from "./RequestActionButtons";

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
            width="auto"
            className="border-green-500 text-green-600 hover:bg-green-50 whitespace-nowrap"
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

  return (
    <TableRow key={request.id}>
      <TableCell>{request.id}</TableCell>
      <TableCell>{request.location}</TableCell>
      <TableCell>{formatDate(request.createdAt)}</TableCell>
      <TableCell>{request.estimatedArrival || 'Not specified'}</TableCell>
      <TableCell>
        <StatusBadge status={request.status} />
      </TableCell>
      <TableCell>
        <RequestActionButtons
          request={request}
          requestIndex={requestIndex}
          acceptRequest={acceptRequest}
          completeRequest={completeRequest}
          addNote={addNote}
          clearRequest={clearRequest}
          setActiveRequest={setActiveRequest}
          handleClearRequest={handleClearRequest}
        />
      </TableCell>
    </TableRow>
  );
};

export default RequestRow;

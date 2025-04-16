
import React, { useState } from "react";
import { Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Request } from "@/types/request";
import RequestDetailsItem from "./RequestDetailsItem";
import RequestDetailsNotes from "./RequestDetailsNotes";

interface RequestDetailsDialogProps {
  request: Request;
  onClose: () => void;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ 
  request, 
  onClose, 
  onAccept,
  onComplete 
}) => {
  const [estimatedTime, setEstimatedTime] = useState("");
  const [note, setNote] = useState("");
  
  // Determine status to show acceptance or completion options
  const isPending = request.status === "pending";
  const isActive = request.status === "active";
  
  // Create completion note
  const handleComplete = () => {
    if (onComplete && note) {
      onComplete(request.id, {
        text: note,
        author: "Support Staff"  // This would be replaced with the actual user
      });
      onClose();
    }
  };

  // Accept request
  const handleAccept = () => {
    if (onAccept && estimatedTime) {
      onAccept(request.id, { estimatedTime });
      onClose();
    }
  };

  // Time options for support staff
  const timeOptions = ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "30 minutes", "45 minutes", "1 hour"];
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>Request {request.id}</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <div className="space-y-4">
          <RequestDetailsItem 
            label="Location"
            value={request.location}
          />
          <RequestDetailsItem 
            label="Asset Type"
            value={request.assetType}
          />
          {request.secondUser && (
            <RequestDetailsItem 
              label="Receiving User"
              value={request.secondUser}
            />
          )}
          <RequestDetailsItem 
            label="Details"
            value={request.details}
            multiline
          />
          <RequestDetailsItem 
            label="Requested By"
            value={request.requestedBy}
          />
          {request.assignedTo && (
            <RequestDetailsItem 
              label="Assigned To"
              value={request.assignedTo}
            />
          )}
          {request.estimatedArrival && (
            <RequestDetailsItem 
              label="Estimated Arrival"
              value={request.estimatedArrival}
            />
          )}
          
          {/* Notes section */}
          {request.notes && request.notes.length > 0 && (
            <RequestDetailsNotes notes={request.notes} />
          )}
          
          {/* Actions based on status */}
          {isPending && onAccept && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h4 className="font-medium">Accept Request</h4>
              <div className="space-y-2">
                <Label htmlFor="estimatedTime" className="flex items-center gap-2">
                  <Clock size={16} className="text-flyerPurple-500" />
                  Estimated Time of Arrival
                </Label>
                <Select
                  value={estimatedTime}
                  onValueChange={setEstimatedTime}
                >
                  <SelectTrigger id="estimatedTime">
                    <SelectValue placeholder="Select estimated time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAccept}
                className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
                disabled={!estimatedTime}
              >
                <Check size={16} className="mr-2" />
                Accept Request
              </Button>
            </div>
          )}
          
          {isActive && onComplete && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h4 className="font-medium">Complete Request</h4>
              <div className="space-y-2">
                <Label htmlFor="completionNote">Completion Note</Label>
                <Textarea
                  id="completionNote"
                  placeholder="Add details about the completion..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!note}
              >
                <Check size={16} className="mr-2" />
                Mark as Completed
              </Button>
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
};

export default RequestDetailsDialog;

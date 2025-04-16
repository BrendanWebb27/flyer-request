
import React, { useState } from "react";
import { Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Request } from "@/types/request";
import RequestDetailsItem from "./RequestDetailsItem";
import RequestDetailsNotes from "./RequestDetailsNotes";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface RequestDetailsDialogProps {
  request: Request;
  onClose: () => void;
  onAccept?: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  highlightAccept?: boolean; // New prop to determine if we should highlight accept functionality
}

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ 
  request, 
  onClose, 
  onAccept,
  onComplete,
  highlightAccept = false
}) => {
  const [estimatedTime, setEstimatedTime] = useState("");
  const [note, setNote] = useState("");
  const { findProfileByUsername } = useProfileAccess();
  
  // Determine status to show acceptance or completion options
  const isPending = request.status === "pending";
  const isActive = request.status === "active";
  
  // Get username from email
  const getDisplayName = (email: string) => {
    const profile = findProfileByUsername(email);
    if (profile && profile.name) {
      return profile.name;
    }
    // Fallback to just the username part of the email if no profile found
    return email.split('@')[0];
  };
  
  // Create completion note
  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onComplete && note) {
      onComplete(request.id, {
        text: note,
        author: "Support Staff"  // This would be replaced with the actual user
      });
      onClose();
    }
  };

  // Accept request - with stopPropagation
  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAccept && estimatedTime) {
      onAccept(request.id, { 
        assignedTo: "Current Support Staff", // Fixed default value
        estimatedTime 
      });
      onClose();
    }
  };

  // Time options for support staff
  const timeOptions = ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "30 minutes", "45 minutes", "1 hour"];

  return (
    <div>
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
            value={getDisplayName(request.requestedBy)}
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
          
          {/* Accept action - only for support staff */}
          {isPending && onAccept && (
            <div className={`space-y-4 border-t pt-4 mt-4 ${highlightAccept ? 'bg-flyerPurple-50 p-4 rounded-lg border border-flyerPurple-200' : ''}`}>
              <h4 className={`font-medium ${highlightAccept ? 'text-flyerPurple-700' : ''}`}>
                {highlightAccept ? 'Accept This Request' : 'Accept Request'}
              </h4>
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
                className={`w-full ${highlightAccept ? 'bg-flyerPurple-600 hover:bg-flyerPurple-700 text-lg py-6' : 'bg-flyerPurple-600 hover:bg-flyerPurple-700'}`}
                disabled={!estimatedTime}
                id="acceptRequestButton"
              >
                <Check size={highlightAccept ? 20 : 16} className="mr-2" />
                {highlightAccept ? 'Accept Request Now' : 'Accept Request'}
              </Button>
            </div>
          )}
          
          {/* Complete action - only for support staff */}
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
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default RequestDetailsDialog;

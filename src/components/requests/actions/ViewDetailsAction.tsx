
import React from "react";
import { Eye } from "lucide-react";
import { Request } from "@/types/request";
import { Button } from "@/components/ui/button";
import ActionButtonSheet from "./ActionButtonSheet";
import { SheetClose } from "@/components/ui/sheet";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface ViewDetailsActionProps {
  request: Request;
  requestId: string;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  setDetailsOpen?: (open: boolean) => void;
}

const ViewDetailsAction: React.FC<ViewDetailsActionProps> = ({
  request,
  requestId,
  onAccept,
  onComplete,
  setDetailsOpen
}) => {
  const { isSupport } = useProfileAccess();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Enhanced event handling to stop propagation of all events
  const stopAllEvents = (e: React.UIEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleComplete = (requestId: string, notes: string) => {
    if (onComplete) {
      onComplete(requestId, { 
        text: notes || "Request completed", 
        author: "Support Staff" 
      });
      setIsOpen(false);
    }
  };

  const handleAcceptButtonClick = (e: React.MouseEvent) => {
    stopAllEvents(e);
    if (setDetailsOpen) setDetailsOpen(true);
    setIsOpen(false);
    
    // Add a short delay to ensure the first dialog is closed
    setTimeout(() => {
      // Open the accept dialog - simulate clicking the accept button
      const acceptButton = document.getElementById('acceptRequestButton');
      if (acceptButton) acceptButton.click();
    }, 100);
  };

  return (
    <div 
      onClick={stopAllEvents} 
      onMouseDown={stopAllEvents}
      onPointerDown={stopAllEvents}
      className="relative"
    >
      <ActionButtonSheet
        buttonText="View Details"
        buttonIcon={<Eye size={16} />}
        buttonVariant="default"
        buttonClass="bg-flyerPurple-600 hover:bg-flyerPurple-700"
        title="Request Details"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className="full-sheet-content">
          {request ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">ID:</div>
                <div>{request.id}</div>
                
                <div className="font-semibold">Location:</div>
                <div>{request.location}</div>
                
                <div className="font-semibold">Status:</div>
                <div>{request.status}</div>
                
                <div className="font-semibold">Created:</div>
                <div>{new Date(request.createdAt).toLocaleString()}</div>
                
                <div className="font-semibold">Requested By:</div>
                <div>{request.requestedBy || "Unknown"}</div>
                
                {request.assignedTo && (
                  <>
                    <div className="font-semibold">Assigned To:</div>
                    <div>{request.assignedTo}</div>
                  </>
                )}
                
                {request.estimatedArrival && (
                  <>
                    <div className="font-semibold">ETA:</div>
                    <div>{request.estimatedArrival}</div>
                  </>
                )}
              </div>
              
              <div>
                <div className="font-semibold mb-1">Details:</div>
                <div className="p-2 bg-gray-50 rounded-md">{request.details}</div>
              </div>
              
              {request.notes && request.notes.length > 0 && (
                <div>
                  <div className="font-semibold mb-1">Notes:</div>
                  <div className="space-y-2">
                    {request.notes.map((note, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-md">
                        <div className="text-sm text-gray-500">
                          {note.author} - {new Date(note.timestamp).toLocaleString()}
                        </div>
                        <div>{note.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action buttons for support users */}
              {isSupport && (
                <div className="flex justify-end gap-2 mt-6">
                  {request.status === "pending" && onAccept && (
                    <SheetClose asChild>
                      <Button 
                        onClick={handleAcceptButtonClick}
                        id="acceptRequestButton"
                      >
                        Accept Request
                      </Button>
                    </SheetClose>
                  )}
                  
                  {request.status === "active" && onComplete && (
                    <SheetClose asChild>
                      <Button 
                        onClick={(e) => {
                          stopAllEvents(e);
                          const notes = prompt("Add completion notes (optional):");
                          if (notes !== null) { // Only if not cancelled
                            handleComplete(requestId, notes);
                          }
                        }}
                      >
                        Complete Request
                      </Button>
                    </SheetClose>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p>Request details not available</p>
            </div>
          )}
        </div>
      </ActionButtonSheet>
    </div>
  );
};

export default ViewDetailsAction;

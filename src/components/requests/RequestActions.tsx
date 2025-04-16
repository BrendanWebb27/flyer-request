
import React, { useState } from "react";
import { Request } from "@/types/request";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import RequestActionPanel from "@/components/RequestActionPanel";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import CompleteRequestButton from "./CompleteRequestButton";

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
  request?: Request;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  onRequestUpdated?: () => void;  // Callback to trigger parent updates
}

export const RequestActions: React.FC<RequestActionsProps> = ({ 
  requestId, 
  onClear, 
  request,
  onAccept,
  onComplete,
  onRequestUpdated
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  const { isSupport } = useProfileAccess();
  
  // Prevent auto-closing of dialogs by stopping propagation
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };
  
  const handleAccept = (id: string, data: { estimatedTime: string }) => {
    if (onAccept) {
      console.log("RequestActions: Accepting request with ID:", id);
      
      try {
        // First close the dialog to avoid UI glitches
        setDetailsOpen(false);
        
        // Call the accept function immediately
        onAccept(id, data);
        
        // Trigger event to update all components
        window.dispatchEvent(new Event('requestUpdated'));
        
        // Also call the callback directly if available
        if (onRequestUpdated) {
          onRequestUpdated();
        }
        
        toast({
          title: "Request Accepted",
          description: `You'll arrive in ${data.estimatedTime}.`,
        });
      } catch (error) {
        console.error("Error accepting request:", error);
        toast({
          title: "Error",
          description: "Failed to accept request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleComplete = (id: string, note: { text: string, author: string }) => {
    if (onComplete) {
      console.log("RequestActions: Completing request with ID:", id);
      
      try {
        // First close the dialog to avoid UI glitches
        setDetailsOpen(false);
        
        // Call the complete function
        onComplete(id, note);
        
        // Trigger event to update all components
        window.dispatchEvent(new Event('requestUpdated'));
        
        // Also call the callback directly if available
        if (onRequestUpdated) {
          onRequestUpdated();
        }
        
        toast({
          title: "Request Completed",
          description: "The request has been marked as completed.",
        });
      } catch (error) {
        console.error("Error completing request:", error);
        toast({
          title: "Error",
          description: "Failed to complete request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleClearRequest = () => {
    onClear(requestId);
  };

  // Check if the request is active to show complete button directly
  const isActive = request?.status === "active";
  // Only show the complete button if user is support staff
  const canCompleteRequest = isSupport && isActive && onComplete;
  
  // Determine if we should show the clear button
  // Now all users can clear requests, but for support users, only completed requests can be cleared
  const showClearButton = !isSupport || 
                          (isSupport && request?.status === "completed");

  return (
    <div 
      className="flex gap-2 self-end md:self-center" 
      onClick={handleDialogClick}
      onMouseDown={handleDialogClick}
    >
      {/* Clear button with sheet/dialog */}
      {showClearButton && (
        <Sheet modal={true}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Trash2 size={16} className="mr-1" />
              Clear
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Clear Request {requestId}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <p className="mb-4">Are you sure you want to clear this request? This will remove it from your view.</p>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  const sheetClose = document.querySelector('[data-radix-collection-item]');
                  if (sheetClose instanceof HTMLElement) sheetClose.click();
                }}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearRequest();
                    const sheetClose = document.querySelector('[data-radix-collection-item]');
                    if (sheetClose instanceof HTMLElement) sheetClose.click();
                  }}
                >
                  Clear Request
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Complete button */}
      {canCompleteRequest && (
        <Sheet modal={true}>
          <SheetTrigger asChild>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <CompleteRequestButton 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }} 
              />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Complete Request {requestId}</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {request && onComplete && (
                <div>
                  <div className="space-y-4">
                    <textarea 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Add completion notes..."
                      rows={4}
                      id="completionNotes"
                    />
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        const notes = document.getElementById('completionNotes') as HTMLTextAreaElement;
                        handleComplete(requestId, { 
                          text: notes?.value || "Request completed", 
                          author: "Support Staff" 
                        });
                        const sheetClose = document.querySelector('[data-radix-collection-item]');
                        if (sheetClose instanceof HTMLElement) sheetClose.click();
                      }}
                    >
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* View details button */}
      <Sheet modal={true}>
        <SheetTrigger asChild>
          <Button 
            size="sm" 
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Eye size={16} className="mr-1" />
            View Details
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
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
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsOpen(true);
                          const sheetClose = document.querySelector('[data-radix-collection-item]');
                          if (sheetClose instanceof HTMLElement) sheetClose.click();
                          
                          // Add a short delay to ensure the first dialog is closed
                          setTimeout(() => {
                            // Open the accept dialog - simulate clicking the accept button
                            const acceptButton = document.getElementById('acceptRequestButton');
                            if (acceptButton) acceptButton.click();
                          }, 100);
                        }}
                      >
                        Accept Request
                      </Button>
                    )}
                    
                    {request.status === "active" && onComplete && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const notes = prompt("Add completion notes (optional):");
                          if (notes !== null) { // Only if not cancelled
                            handleComplete(requestId, { 
                              text: notes || "Request completed", 
                              author: "Support Staff" 
                            });
                            const sheetClose = document.querySelector('[data-radix-collection-item]');
                            if (sheetClose instanceof HTMLElement) sheetClose.click();
                          }
                        }}
                      >
                        Complete Request
                      </Button>
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
        </SheetContent>
      </Sheet>
      
      {/* Hidden button for accept flow */}
      {isSupport && request?.status === "pending" && onAccept && (
        <Sheet modal={true}>
          <SheetTrigger asChild>
            <Button
              id="acceptRequestButton"
              className="hidden"
            >
              Hidden Accept
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Accept Request {requestId}</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <RequestActionPanel 
                requestId={requestId} 
                onAccept={(data) => handleAccept(requestId, data)} 
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default RequestActions;

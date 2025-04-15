
import React from "react";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Request } from "@/types/request";
import RequestStatusBadge from "./RequestStatusBadge";

interface RequestActionsProps {
  requestId: string;
  onClear: (id: string) => void;
  request?: Request;
}

export const RequestActions: React.FC<RequestActionsProps> = ({ requestId, onClear, request }) => {
  return (
    <div className="flex gap-2 self-end md:self-center">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} />
            Clear
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear this request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the request from your view. You can undo this action for a short time after clearing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onClear(requestId)}>
              Clear Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
          >
            <Eye size={16} className="mr-1" />
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {request ? (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Request {request.id}</DialogTitle>
                  <RequestStatusBadge status={request.status} />
                </div>
                <DialogDescription>
                  Created on {new Date(request.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Location</h3>
                  <p>{request.location}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Details</h3>
                  <p>{request.details}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Requested By</h3>
                  <p>{request.requestedBy}</p>
                </div>
                
                {request.assignedTo && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Assigned To</h3>
                    <p>{request.assignedTo}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Estimated Duration</h3>
                  <p>{request.estimatedDuration}</p>
                </div>
                
                {request.estimatedArrival && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Estimated Arrival</h3>
                    <p>{request.estimatedArrival}</p>
                  </div>
                )}
                
                {request.completedAt && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Completed At</h3>
                    <p>{new Date(request.completedAt).toLocaleString()}</p>
                  </div>
                )}
                
                {request.notes && request.notes.length > 0 && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Notes</h3>
                    <div className="space-y-2">
                      {request.notes.map((note, index) => (
                        <div key={index} className="bg-muted p-3 rounded-md">
                          <p className="text-sm">{note.text}</p>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{note.author}</span>
                            <span>{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p>Request details not available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestActions;

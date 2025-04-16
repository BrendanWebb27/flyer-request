
import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Check, Trash2 } from "lucide-react";
import { Request } from "@/types/request";
import RequestActionPanel from "@/components/RequestActionPanel";
import CompletionForm from "./CompletionForm";
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

interface RequestActionButtonsProps {
  request: Request;
  requestIndex: number;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
  clearRequest?: (id: string) => void;
  setActiveRequest: (id: string | null) => void;
  handleClearRequest: () => void;
}

const RequestActionButtons: React.FC<RequestActionButtonsProps> = ({
  request,
  acceptRequest,
  completeRequest,
  addNote,
  clearRequest,
  setActiveRequest,
  handleClearRequest
}) => {
  const { isSupport } = useProfileAccess();
  
  const showClearButton = !isSupport || 
                          (isSupport && request.status === "completed");

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-end">
      {request.status === "pending" && (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              width="auto"
              className="whitespace-nowrap"
            >
              Accept
            </Button>
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
              width="auto"
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 whitespace-nowrap"
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
              width="auto"
              className="text-red-500 border-red-200 hover:bg-red-50 whitespace-nowrap"
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
      
      <Button 
        variant="ghost" 
        size="sm"
        width="auto" 
        className="whitespace-nowrap"
      >
        Details
      </Button>
    </div>
  );
};

export default RequestActionButtons;

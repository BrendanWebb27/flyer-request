
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface ClearRequestButtonProps {
  requestId: string;
  handleClearRequest: () => void;
}

const ClearRequestButton: React.FC<ClearRequestButtonProps> = ({
  requestId,
  handleClearRequest
}) => {
  const { isSupport, getUserProfile } = useProfileAccess();
  const [open, setOpen] = React.useState(false);
  
  // Get user profile to check work center
  const userProfile = getUserProfile();
  const userWorkCenter = userProfile?.workCenter || '';
  
  // Define general work centers that should have clear access
  const generalWorkCenters = ["AVI", "ENG", "WPN", "APG", "E&E"];
  
  // Check if user has clear permission based on work center
  const hasClearPermission = generalWorkCenters.includes(userWorkCenter) && !isSupport;
  
  // Determine button style based on user role
  const buttonStyle = isSupport 
    ? "text-red-500 border-red-200 hover:bg-red-50" 
    : "text-gray-500 border-gray-200 hover:bg-gray-50";

  // If user doesn't have permission, don't render the button
  if (!hasClearPermission && isSupport) {
    return null;
  }

  const handleConfirmClear = () => {
    handleClearRequest();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`whitespace-nowrap flex-shrink-0 ${buttonStyle}`}
        >
          <Trash2 size={16} className="mr-1" />
          Clear
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear this request?</DialogTitle>
          <DialogDescription>
            This will remove request {requestId} from your view. You'll have the option to undo this action.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmClear}>
            <Check size={16} className="mr-1" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearRequestButton;

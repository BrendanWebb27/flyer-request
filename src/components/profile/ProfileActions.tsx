
import React from "react";
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
  isSupport?: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ 
  isEditing, 
  setIsEditing, 
  onSave,
  isSupport = false 
}) => {
  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    e.preventDefault();
    action();
  };

  return (
    <div className="flex gap-2 justify-end w-full min-w-[180px]">
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={(e) => handleButtonClick(e, () => setIsEditing(false))}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700 w-full sm:w-auto" 
            onClick={(e) => handleButtonClick(e, onSave)}
          >
            Save Changes
          </Button>
        </>
      ) : (
        <Button 
          className="bg-flyerPurple-600 hover:bg-flyerPurple-700 w-full sm:w-auto" 
          onClick={(e) => handleButtonClick(e, () => setIsEditing(true))}
        >
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;

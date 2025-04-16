
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
    <>
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={(e) => handleButtonClick(e, () => setIsEditing(false))}
          >
            Cancel
          </Button>
          <Button 
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700" 
            onClick={(e) => handleButtonClick(e, onSave)}
          >
            Save Changes
          </Button>
        </>
      ) : (
        <Button 
          className="bg-flyerPurple-600 hover:bg-flyerPurple-700" 
          onClick={(e) => handleButtonClick(e, () => setIsEditing(true))}
        >
          Edit Profile
        </Button>
      )}
    </>
  );
};

export default ProfileActions;

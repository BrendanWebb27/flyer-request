
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
  return (
    <>
      {isEditing ? (
        <>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button 
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700" 
            onClick={onSave}
          >
            Save Changes
          </Button>
        </>
      ) : (
        <Button 
          className="bg-flyerPurple-600 hover:bg-flyerPurple-700" 
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      )}
    </>
  );
};

export default ProfileActions;

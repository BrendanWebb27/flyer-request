
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserProfile } from "@/types/profile";

interface FlyerStatusFormProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
}

const FlyerStatusForm: React.FC<FlyerStatusFormProps> = ({ profile, setProfile, isEditing }) => {
  return (
    <div className="space-y-2">
      <Label>Flyer Status</Label>
      {isEditing ? (
        <div className="space-y-3">
          <ToggleGroup 
            type="single" 
            variant="outline" 
            disabled={!isEditing}
            value={profile.isFlyer ? "yes" : "no"}
            onValueChange={(value) => {
              if (value === "yes") setProfile(prev => ({...prev, isFlyer: true}));
              if (value === "no") setProfile(prev => ({...prev, isFlyer: false}));
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="yes" className="px-4">I am a flyer</ToggleGroupItem>
            <ToggleGroupItem value="no" className="px-4">I am not a flyer</ToggleGroupItem>
          </ToggleGroup>
          
          {profile.isFlyer && (
            <ToggleGroup 
              type="single" 
              variant="outline" 
              disabled={!isEditing}
              value={profile.flyerRole}
              onValueChange={(value) => {
                if (value) setProfile(prev => ({...prev, flyerRole: value}));
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="primary" className="px-4">Primary</ToggleGroupItem>
              <ToggleGroupItem value="alternate" className="px-4">Alternate</ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      ) : (
        <Input 
          value={profile.isFlyer ? `Flyer - ${profile.flyerRole === "primary" ? "Primary" : "Alternate"}` : "Not a flyer"} 
          disabled 
        />
      )}
    </div>
  );
};

export default FlyerStatusForm;


import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ProfileFormProps {
  profile: {
    manNumber: string;
    organization: string;
    workShift: string;
    isFlyer: boolean;
    flyerRole: string;
    isSupport: boolean;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    manNumber: string;
    organization: string;
    workShift: string;
    isFlyer: boolean;
    flyerRole: string;
    isSupport: boolean;
  }>>;
  isEditing: boolean;
  organizations: string[];
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile, isEditing, organizations }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="manNumber">Man Number & Name</Label>
        <Input 
          id="manNumber" 
          value={profile.manNumber} 
          onChange={(e) => setProfile({...profile, manNumber: e.target.value})}
          disabled={!isEditing} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        {isEditing ? (
          <Select 
            defaultValue={profile.organization}
            onValueChange={(value) => setProfile({...profile, organization: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org} value={org}>{org}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input id="organization" value={profile.organization} disabled />
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Work Shift</Label>
        <ToggleGroup 
          type="single" 
          variant="outline" 
          disabled={!isEditing}
          value={profile.workShift}
          onValueChange={(value) => {
            if (value) setProfile({...profile, workShift: value});
          }}
          className="justify-start flex-wrap"
        >
          <ToggleGroupItem value="midshift" className="px-4">Mid-shift</ToggleGroupItem>
          <ToggleGroupItem value="dayshift" className="px-4">Dayshift</ToggleGroupItem>
          <ToggleGroupItem value="swingshift" className="px-4">Swing-shift</ToggleGroupItem>
          <ToggleGroupItem value="fourthshift" className="px-4">Fourth shift</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ProfileForm;


import React from "react";
import { User, Building2, Clock } from "lucide-react";

interface ProfileAvatarProps {
  profile: {
    manNumber: string;
    organization: string;
    workShift: string;
    isFlyer: boolean;
    flyerRole: string;
    isSupport: boolean;
  };
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-flyerPurple-100 flex items-center justify-center">
          <User size={48} className="text-flyerPurple-600" />
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <p className="text-base font-medium">Man Number: {profile.manNumber}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
            <Building2 size={14} className="text-flyerPurple-500" />
            <span>{profile.organization}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
            <Clock size={14} className="text-flyerPurple-500" />
            <span className="capitalize">{profile.workShift}</span>
          </div>
          
          {profile.isSupport && profile.isFlyer && (
            <div className="flex items-center gap-1 bg-flyerPurple-100 text-flyerPurple-700 px-3 py-1 rounded-full text-sm font-medium">
              Flyer {profile.flyerRole === "primary" ? "Primary" : "Alternate"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;

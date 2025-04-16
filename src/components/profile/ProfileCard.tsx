
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import FlyerStatusForm from "@/components/profile/FlyerStatusForm";
import ProfileActions from "@/components/profile/ProfileActions";
import EmailVerificationStatus from "@/components/profile/EmailVerificationStatus";
import OrganizationVerificationSection from "@/components/profile/OrganizationVerificationSection";
import { UserProfile } from "@/types/profile";

interface ProfileCardProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
  isEmailVerified: boolean;
  handleVerifyOrganization: () => void;
  organizations: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
  onSave,
  isEmailVerified,
  handleVerifyOrganization,
  organizations
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Manage your account details and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileAvatar profile={profile} />
        
        <ProfileForm 
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          organizations={organizations}
        />
        
        {/* Show Flyer Status for everyone */}
        <FlyerStatusForm 
          profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
        />
        
        {/* Email verification status indicator */}
        <EmailVerificationStatus isEmailVerified={isEmailVerified} />
        
        {/* Organization verification button - for all users who haven't verified email */}
        <OrganizationVerificationSection 
          isEmailVerified={isEmailVerified}
          handleVerifyOrganization={handleVerifyOrganization}
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <ProfileActions 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={onSave}
          isSupport={profile.isSupport}
        />
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;

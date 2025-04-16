
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import FlyerStatusForm from "@/components/profile/FlyerStatusForm";
import ProfileActions from "@/components/profile/ProfileActions";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const { getUserProfile, saveUserProfile, isSupport, isSupportOrganization } = useProfileAccess();
  const [isEditing, setIsEditing] = useState(false);
  
  // Load profile data from localStorage or use defaults
  const [profile, setProfile] = useState(() => {
    const savedProfile = getUserProfile();
    if (savedProfile) {
      return savedProfile;
    }
    return {
      manNumber: "12345",
      organization: "IT Department",
      workShift: "dayshift",
      isFlyer: true,
      flyerRole: "primary",
      isSupport: false // Default to false
    };
  });

  // Check if the organization is "Support" and update isSupport accordingly
  useEffect(() => {
    const isUserSupport = isSupportOrganization(profile.organization);
    if (profile.isSupport !== isUserSupport) {
      setProfile(prev => ({
        ...prev,
        isSupport: isUserSupport
      }));
    }
  }, [profile.organization, isSupportOrganization]);

  // Save profile data to localStorage whenever it changes
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile, saveUserProfile]);

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully."
      });
    }, 500);
  };

  const organizations = [
    "Support", 
    "APG", 
    "AVI", 
    "E&E", 
    "ENG", 
    "WPN"
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileHeader />
      
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
          
          {/* Only show Flyer Status for support members */}
          {profile.isSupport && (
            <FlyerStatusForm 
              profile={profile}
              setProfile={setProfile}
              isEditing={isEditing}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <ProfileActions 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSave={handleSaveProfile}
            isSupport={profile.isSupport}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;

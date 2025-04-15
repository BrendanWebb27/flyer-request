import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import FlyerStatusForm from "@/components/profile/FlyerStatusForm";
import ProfileActions from "@/components/profile/ProfileActions";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user profile data
  const [profile, setProfile] = useState({
    manNumber: "12345",
    organization: "IT Department",
    workShift: "dayshift",
    isFlyer: true,
    flyerRole: "primary",
    isSupport: true // Mock support status for demonstration
  });

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
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;

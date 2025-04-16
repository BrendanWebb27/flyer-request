
import React, { useState, useEffect } from "react";
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
  
  // Load profile data from localStorage or use defaults
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return {
      manNumber: "12345",
      organization: "IT Department",
      workShift: "dayshift",
      isFlyer: true,
      flyerRole: "primary",
      isSupport: true // Default support status
    };
  });

  // Save profile data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // Update support access flag for sidebar and role-based features
    localStorage.setItem("supportAccessGranted", profile.isSupport ? "true" : "false");
    
    // Trigger a storage event for other components to detect the change
    window.dispatchEvent(new Event("storage"));
  }, [profile]);

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      
      // Save updated profile to localStorage
      localStorage.setItem("userProfile", JSON.stringify(profile));
      
      // Update support access flag
      localStorage.setItem("supportAccessGranted", profile.isSupport ? "true" : "false");
      
      // Notify other components about the change
      window.dispatchEvent(new Event("storage"));
      
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

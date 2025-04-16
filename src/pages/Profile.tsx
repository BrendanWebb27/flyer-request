import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import { updateUserActivityTimestamp } from "@/utils/userDataExpiration";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileForm from "@/components/profile/ProfileForm";
import FlyerStatusForm from "@/components/profile/FlyerStatusForm";
import ProfileActions from "@/components/profile/ProfileActions";
import NotificationsForm from "@/components/profile/NotificationsForm";
import OrganizationAccessControl from "@/components/OrganizationAccessControl";
import ProfileDebugger from "@/components/profile/ProfileDebugger";
import { checkForProfile, logAllProfiles } from "@/utils/profileUtils";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const { getUserProfile, saveUserProfile, isSupport, isSupportOrganization } = useProfileAccess();
  const [isEditing, setIsEditing] = useState(false);
  const [showOrgVerification, setShowOrgVerification] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
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

  // Check if email is verified
  useEffect(() => {
    // Check localStorage for email verification status
    const emailVerified = localStorage.getItem("emailVerified") === "true";
    setIsEmailVerified(emailVerified);
  }, []);

  // Update the activity timestamp when the profile page is loaded
  useEffect(() => {
    updateUserActivityTimestamp();
    
    // Check for profile with username "69" as requested
    const { exists, profile } = checkForProfile("69");
    if (exists) {
      console.log("Found profile with username '69':", profile);
    } else {
      console.log("No profile found with username '69'");
    }
    
    // Log all profiles for debugging
    logAllProfiles();
  }, []);

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
    // Update activity timestamp whenever profile is updated
    updateUserActivityTimestamp();
  }, [profile, saveUserProfile]);

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      // Update activity timestamp on profile save
      updateUserActivityTimestamp();
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully."
      });
    }, 500);
  };

  const handleVerifyOrganization = () => {
    setShowOrgVerification(true);
  };

  const handleAccessGranted = () => {
    setShowOrgVerification(false);
    setIsEmailVerified(true);
    localStorage.setItem("emailVerified", "true");
    
    toast({
      title: "Organization Verified",
      description: "Your organization access has been verified successfully."
    });
    // Reload the profile to reflect the changes
    const savedProfile = getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  };

  const organizations = [
    "Support", 
    "APG", 
    "AVI", 
    "E&E", 
    "ENG", 
    "WPN"
  ];

  // Show organization verification if requested
  if (showOrgVerification) {
    return <OrganizationAccessControl onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileHeader />
      
      {/* Add the ProfileDebugger component */}
      <ProfileDebugger />
      
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
          
          {/* Email verification status indicator */}
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Verification</h4>
                <p className="text-xs text-muted-foreground">
                  {isEmailVerified ? "Your email has been verified" : "Email verification required for system access"}
                </p>
              </div>
              <div className={`px-2 py-1 rounded ${isEmailVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                <span className="text-xs font-medium">
                  {isEmailVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Organization verification button - for all users who haven't verified email */}
          {!isEmailVerified && (
            <div className="pt-4">
              <button
                className="text-sm text-flyerPurple-600 hover:text-flyerPurple-700 font-medium"
                onClick={handleVerifyOrganization}
              >
                Verify Organization Access
              </button>
              <p className="text-xs text-muted-foreground mt-1">
                Verify your organization access to gain system privileges
              </p>
            </div>
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
      
      {/* Add the notifications form */}
      <NotificationsForm isEditing={isEditing} />
    </div>
  );
};

export default Profile;

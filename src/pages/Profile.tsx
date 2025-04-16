
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import { updateUserActivityTimestamp } from "@/utils/userDataExpiration";
import { UserProfile } from "@/types/profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCard from "@/components/profile/ProfileCard";
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
  const [profile, setProfile] = useState<UserProfile>(() => {
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
      isSupport: false
    };
  });

  // Check if email is verified
  useEffect(() => {
    // Check localStorage for email verification status
    const emailVerified = localStorage.getItem("emailVerified") === "true";
    setIsEmailVerified(emailVerified);
    
    // Log critical information for debugging
    console.log("Profile loaded with:", {
      organization: profile.organization,
      isSupport: profile.isSupport,
      emailVerified: emailVerified
    });
    
  }, [profile.organization]);

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
      console.log("Updating isSupport based on organization:", profile.organization, "isSupport:", isUserSupport);
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
    // Check if organization is support organization and update isSupport flag
    const isUserSupport = isSupportOrganization(profile.organization);
    if (profile.isSupport !== isUserSupport) {
      setProfile(prev => ({
        ...prev,
        isSupport: isUserSupport
      }));
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      // Update activity timestamp on profile save
      updateUserActivityTimestamp();
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully."
      });
      
      // Force update of support access
      if (profile.organization === "Support" || profile.isSupport) {
        localStorage.setItem("supportAccessGranted", "true");
        toast({
          title: "Support Access Granted",
          description: "You now have support staff access."
        });
      }
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
      
      <ProfileCard 
        profile={profile}
        setProfile={setProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSave={handleSaveProfile}
        isEmailVerified={isEmailVerified}
        handleVerifyOrganization={handleVerifyOrganization}
        organizations={organizations}
      />
      
      {/* Add the notifications form */}
      <NotificationsForm isEditing={isEditing} />
    </div>
  );
};

export default Profile;


import { useEffect, useState } from "react";
import { clearExpiredUserData, updateUserActivityTimestamp } from "@/utils/userDataExpiration";

interface UserProfile {
  name?: string;
  manNumber?: string;
  organization: string;
  workShift?: string;
  isFlyer?: boolean;
  flyerRole?: string;
}

/**
 * Custom hook to handle profile access and support role management
 * Centralizes the logic for determining if a user has support access
 */
export function useProfileAccess() {
  // Check if the user has support access
  const [isSupport, setIsSupport] = useState(false);
  
  // Load support status on initial mount and check for expired data
  useEffect(() => {
    // Check for expired user data first
    const wasDataCleared = clearExpiredUserData();
    
    if (!wasDataCleared) {
      // Only check support access if data wasn't cleared
      const checkSupportAccess = () => {
        const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
        setIsSupport(hasAccess);
        
        // Update activity timestamp when checking access
        if (hasAccess) {
          updateUserActivityTimestamp();
        }
      };
      
      // Check on mount
      checkSupportAccess();
      
      // Listen for storage events (profile updates)
      window.addEventListener("storage", checkSupportAccess);
      
      return () => {
        window.removeEventListener("storage", checkSupportAccess);
      };
    }
  }, []);

  // Helper functions to work with support access
  const getSupportAccess = () => {
    // Check for expired data first
    if (clearExpiredUserData()) {
      return false;
    }
    
    const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
    
    // Update activity timestamp if the user has access
    if (hasAccess) {
      updateUserActivityTimestamp();
    }
    
    return hasAccess;
  };
  
  const setSupportAccess = (hasAccess: boolean) => {
    localStorage.setItem("supportAccessGranted", hasAccess ? "true" : "false");
    
    // Update activity timestamp when setting access
    if (hasAccess) {
      updateUserActivityTimestamp();
    }
    
    setIsSupport(hasAccess);
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };
  
  // Helper to check if a user's organization is support
  const isSupportOrganization = (organization: string) => {
    return organization === "Support";
  };
  
  // Get user profile from localStorage
  const getUserProfile = () => {
    // Check for expired data first
    if (clearExpiredUserData()) {
      return null;
    }
    
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      // Update activity timestamp when getting user profile
      updateUserActivityTimestamp();
      return JSON.parse(savedProfile);
    }
    
    return null;
  };
  
  // Get all profiles from localStorage, including any mock support staff
  const getAllSupportProfiles = (): UserProfile[] => {
    // Update activity timestamp when getting profiles
    updateUserActivityTimestamp();
    
    // Get the current user's profile first
    const currentProfile = getUserProfile();
    
    // Check if we should include the current user in support staff
    const isCurrentUserSupport = currentProfile && 
                                 currentProfile.organization === "Support";
    
    // Get any stored support profiles 
    let supportProfiles: UserProfile[] = [];
    const storedProfiles = localStorage.getItem("supportProfiles");
    
    if (storedProfiles) {
      supportProfiles = JSON.parse(storedProfiles);
    }
    
    // Add mock support staff if no profiles are available
    if (supportProfiles.length === 0 && !isCurrentUserSupport) {
      supportProfiles = [
        { name: "John Doe", organization: "Support", workShift: "dayshift" },
        { name: "Sarah Johnson", organization: "Support", workShift: "dayshift" },
        { name: "Mike Wilson", organization: "Support", workShift: "nightshift" },
        { name: "Emily Brown", organization: "Support", workShift: "nightshift" }
      ];
      
      // Store mock profiles for future use
      localStorage.setItem("supportProfiles", JSON.stringify(supportProfiles));
    }
    
    // Add current user if they are support staff
    if (isCurrentUserSupport && currentProfile) {
      const currentUserName = currentProfile.name || "Current Support Staff";
      
      // Check if current user is already in the list
      const exists = supportProfiles.some(
        profile => profile.name === currentUserName
      );
      
      if (!exists) {
        supportProfiles.unshift({
          ...currentProfile,
          name: currentUserName
        });
      }
    }
    
    return supportProfiles;
  };
  
  // Save profile to localStorage
  const saveUserProfile = (profile: any) => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // Update activity timestamp when saving profile
    updateUserActivityTimestamp();
    
    // Update support access based on organization
    const hasAccess = isSupportOrganization(profile.organization);
    setSupportAccess(hasAccess);
    
    // If profile is for support staff, update the support profiles list
    if (hasAccess) {
      const supportProfiles = getAllSupportProfiles();
      
      // Check if profile already exists in support profiles
      const existingIndex = supportProfiles.findIndex(
        p => p.manNumber === profile.manNumber
      );
      
      if (existingIndex >= 0) {
        // Update existing profile
        supportProfiles[existingIndex] = {...profile};
      } else {
        // Add profile to support staff list
        supportProfiles.unshift({...profile});
      }
      
      // Save updated support profiles
      localStorage.setItem("supportProfiles", JSON.stringify(supportProfiles));
    }
  };

  return {
    isSupport,
    getSupportAccess,
    setSupportAccess,
    isSupportOrganization,
    getUserProfile,
    saveUserProfile,
    getAllSupportProfiles
  };
}

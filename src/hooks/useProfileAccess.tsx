
import { useEffect, useState } from "react";
import { clearExpiredUserData, getVerifiedEmails } from "@/utils/userDataExpiration";
import { UserProfile } from "@/types/profile";
import { 
  getUserProfile, 
  saveUserProfile, 
  getAllSupportProfiles,
  isSupportOrganization,
  findProfileByUsername
} from "@/utils/profileOperations";
import {
  getSupportAccess,
  setSupportAccess,
  isUserVerified,
  updateSupportAccessFromProfile
} from "@/utils/supportAccess";

/**
 * Custom hook to handle profile access and support role management
 * Centralizes the logic for determining if a user has support access
 */
export function useProfileAccess() {
  // Check if the user has support access
  const [isSupport, setIsSupport] = useState(false);
  // Track if user is verified
  const [isVerified, setIsVerified] = useState(false);
  
  // Load support status and verification status on initial mount and check for expired data
  useEffect(() => {
    // Check for expired user data first
    const wasDataCleared = clearExpiredUserData();
    
    if (!wasDataCleared) {
      // Only check support access if data wasn't cleared
      const checkSupportAccess = () => {
        const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
        console.log("Support access check:", hasAccess);
        setIsSupport(hasAccess);
        
        // Check if user is verified
        const isEmailVerified = localStorage.getItem("emailVerified") === "true";
        setIsVerified(isEmailVerified);
        
        // Auto-verify if email is in the verified list
        const verifiedEmails = getVerifiedEmails();
        const userEmail = localStorage.getItem("supportUserEmail");
        if (userEmail && verifiedEmails.includes(userEmail) && !isEmailVerified) {
          localStorage.setItem("emailVerified", "true");
          setIsVerified(true);
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

  // Custom save function that also updates support status
  const saveUserProfileWithAccessUpdate = (profile: UserProfile) => {
    saveUserProfile(profile);
    updateSupportAccessFromProfile(profile);
    setIsSupport(isSupportOrganization(profile.organization));
  };

  // Return all the functions and state needed by components
  return {
    isSupport,
    isVerified,
    isUserVerified,
    getSupportAccess,
    setSupportAccess,
    isSupportOrganization,
    getUserProfile,
    saveUserProfile: saveUserProfileWithAccessUpdate,
    getAllSupportProfiles,
    findProfileByUsername
  };
}


import { useEffect, useState } from "react";

/**
 * Custom hook to handle profile access and support role management
 * Centralizes the logic for determining if a user has support access
 */
export function useProfileAccess() {
  // Check if the user has support access
  const [isSupport, setIsSupport] = useState(false);
  
  // Load support status on initial mount
  useEffect(() => {
    const checkSupportAccess = () => {
      const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
      setIsSupport(hasAccess);
    };
    
    // Check on mount
    checkSupportAccess();
    
    // Listen for storage events (profile updates)
    window.addEventListener("storage", checkSupportAccess);
    
    return () => {
      window.removeEventListener("storage", checkSupportAccess);
    };
  }, []);

  // Helper functions to work with support access
  const getSupportAccess = () => {
    return localStorage.getItem("supportAccessGranted") === "true";
  };
  
  const setSupportAccess = (hasAccess: boolean) => {
    localStorage.setItem("supportAccessGranted", hasAccess ? "true" : "false");
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
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    
    return null;
  };
  
  // Save profile to localStorage
  const saveUserProfile = (profile: any) => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // Update support access based on organization
    const hasAccess = isSupportOrganization(profile.organization);
    setSupportAccess(hasAccess);
  };

  return {
    isSupport,
    getSupportAccess,
    setSupportAccess,
    isSupportOrganization,
    getUserProfile,
    saveUserProfile
  };
}

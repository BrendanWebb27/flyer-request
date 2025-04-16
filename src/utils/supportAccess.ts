
import { updateUserActivityTimestamp, clearExpiredUserData } from "./userDataExpiration";
import { UserProfile } from "@/types/profile";
import { isSupportOrganization, getUserProfile, saveUserProfile } from "./profileOperations";

/**
 * Helper functions for support access management
 */

// Check if user has support access
export const getSupportAccess = (): boolean => {
  // Check for expired data first
  if (clearExpiredUserData()) {
    return false;
  }
  
  const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
  console.log("getSupportAccess result:", hasAccess);
  
  // Update activity timestamp if the user has access
  if (hasAccess) {
    updateUserActivityTimestamp();
  }
  
  return hasAccess;
};

// Set support access status
export const setSupportAccess = (hasAccess: boolean): void => {
  console.log("Setting support access to:", hasAccess);
  localStorage.setItem("supportAccessGranted", hasAccess ? "true" : "false");
  
  // Update activity timestamp when setting access
  if (hasAccess) {
    updateUserActivityTimestamp();
  }
  
  // Dispatch storage event to notify other components
  window.dispatchEvent(new Event("storage"));
};

// Helper to check if user is verified
export const isUserVerified = (): boolean => {
  return localStorage.getItem("emailVerified") === "true";
};

// Update support access based on profile
export const updateSupportAccessFromProfile = (profile: UserProfile): void => {
  // Update support access based on organization
  const hasAccess = isSupportOrganization(profile.organization);
  setSupportAccess(hasAccess);
  
  // If profile is for support staff, update the support profiles list
  if (hasAccess) {
    const supportProfiles = JSON.parse(localStorage.getItem("supportProfiles") || "[]");
    
    // Check if profile already exists in support profiles
    const existingIndex = supportProfiles.findIndex(
      (p: UserProfile) => p.manNumber === profile.manNumber
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

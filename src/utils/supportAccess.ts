
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
    console.log("Support access check: User data expired");
    return false;
  }
  
  const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
  console.log("getSupportAccess result:", hasAccess);
  
  // Check profile for support organization as backup
  if (!hasAccess) {
    const profile = getUserProfile();
    if (profile && (profile.organization === "Support" || profile.isSupport)) {
      console.log("Found support access from profile organization or isSupport flag");
      setSupportAccess(true);
      return true;
    }
  }
  
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
    // Make sure verifiedEmails includes the current user's email
    try {
      const userEmail = localStorage.getItem("supportUserEmail");
      if (userEmail) {
        const verifiedEmails = JSON.parse(localStorage.getItem("verifiedEmails") || "[]");
        if (!verifiedEmails.includes(userEmail)) {
          verifiedEmails.push(userEmail);
          localStorage.setItem("verifiedEmails", JSON.stringify(verifiedEmails));
          localStorage.setItem("emailVerified", "true");
        }
      }
    } catch (e) {
      console.error("Error updating verified emails:", e);
    }
  }
  
  // Dispatch storage event to notify other components
  try {
    window.dispatchEvent(new Event("storage"));
    // Add an additional custom event for better cross-component communication
    window.dispatchEvent(new CustomEvent("supportAccessChanged", { 
      detail: { hasAccess } 
    }));
  } catch (e) {
    console.error("Error dispatching events:", e);
  }
};

// Helper to check if user is verified
export const isUserVerified = (): boolean => {
  const verified = localStorage.getItem("emailVerified") === "true";
  console.log("User verified status:", verified);
  return verified;
};

// Update support access based on profile
export const updateSupportAccessFromProfile = (profile: UserProfile): void => {
  // Update support access based on organization
  const hasAccess = profile.isSupport || isSupportOrganization(profile.organization);
  console.log("Updating support access from profile:", profile.organization, "hasAccess:", hasAccess);
  
  if (profile.isSupport !== hasAccess) {
    console.log("Profile isSupport flag doesn't match organization status, updating...");
    // Update the profile's isSupport property to match the organization
    const updatedProfile = {
      ...profile,
      isSupport: hasAccess
    };
    
    // Save the updated profile
    saveUserProfile(updatedProfile);
  } else {
    // Only update the access status
    setSupportAccess(hasAccess);
  }
  
  // If profile is for support staff, update the support profiles list
  if (hasAccess) {
    let supportProfiles: UserProfile[] = [];
    try {
      const storedProfiles = localStorage.getItem("supportProfiles");
      if (storedProfiles) {
        supportProfiles = JSON.parse(storedProfiles);
      }
      
      // Check if profile already exists in support profiles
      const existingIndex = supportProfiles.findIndex(
        (p: UserProfile) => p.manNumber === profile.manNumber
      );
      
      if (existingIndex >= 0) {
        // Update existing profile
        supportProfiles[existingIndex] = {...profile, isSupport: true};
      } else {
        // Add profile to support staff list
        supportProfiles.unshift({...profile, isSupport: true});
      }
      
      // Save updated support profiles
      localStorage.setItem("supportProfiles", JSON.stringify(supportProfiles));
      
      // Also update email in verified emails for support staff
      const userEmail = localStorage.getItem("supportUserEmail");
      if (userEmail) {
        const verifiedEmails = JSON.parse(localStorage.getItem("verifiedEmails") || "[]");
        if (!verifiedEmails.includes(userEmail)) {
          verifiedEmails.push(userEmail);
          localStorage.setItem("verifiedEmails", JSON.stringify(verifiedEmails));
        }
      }
      
      // Force verification for support staff
      localStorage.setItem("emailVerified", "true");
    } catch (e) {
      console.error("Error updating support profiles:", e);
    }
  }
};

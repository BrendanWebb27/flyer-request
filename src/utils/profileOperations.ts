
import { UserProfile } from "@/types/profile";
import { updateUserActivityTimestamp } from "./userDataExpiration";

/**
 * Helper functions for profile operations
 */

// Get user profile from localStorage
export const getUserProfile = (): UserProfile | null => {
  const savedProfile = localStorage.getItem("userProfile");
  if (savedProfile) {
    // Update activity timestamp when getting user profile
    updateUserActivityTimestamp();
    return JSON.parse(savedProfile);
  }
  return null;
};

// Save profile to localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.getItem("userProfile") !== JSON.stringify(profile) && 
    localStorage.setItem("userProfile", JSON.stringify(profile));
  
  // Update activity timestamp when saving profile
  updateUserActivityTimestamp();
};

// Check if a user's organization is support
export const isSupportOrganization = (organization: string): boolean => {
  return organization === "Support";
};

// Get all profiles from localStorage, including any mock support staff
export const getAllSupportProfiles = (): UserProfile[] => {
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

// Find a profile by username (or manNumber)
export const findProfileByUsername = (username: string): UserProfile | null => {
  // First check in the current user's profile
  const currentProfile = getUserProfile();
  if (currentProfile && currentProfile.manNumber === username) {
    return currentProfile;
  }
  
  // Then check in all support profiles
  const supportProfiles = getAllSupportProfiles();
  const foundProfile = supportProfiles.find(
    profile => profile.manNumber === username || profile.name?.includes(username)
  );
  
  // Also check in localStorage for any other profiles
  try {
    const allProfiles = localStorage.getItem("allUserProfiles");
    if (allProfiles) {
      const parsedProfiles = JSON.parse(allProfiles) as UserProfile[];
      const profile = parsedProfiles.find(
        p => p.manNumber === username || p.name?.includes(username)
      );
      if (profile) return profile;
    }
  } catch (e) {
    console.error("Error parsing stored profiles:", e);
  }
  
  return foundProfile || null;
};

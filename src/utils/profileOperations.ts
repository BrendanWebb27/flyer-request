
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
      { 
        name: "John Doe", 
        organization: "Support", 
        workShift: "dayshift",
        manNumber: "S12345",
        isFlyer: false,
        flyerRole: "none",
        isSupport: true
      },
      { 
        name: "Sarah Johnson", 
        organization: "Support", 
        workShift: "dayshift",
        manNumber: "S23456",
        isFlyer: true,
        flyerRole: "primary",
        isSupport: true
      },
      { 
        name: "Mike Wilson", 
        organization: "Support", 
        workShift: "nightshift",
        manNumber: "S34567",
        isFlyer: true,
        flyerRole: "alternate",
        isSupport: true
      },
      { 
        name: "Emily Brown", 
        organization: "Support", 
        workShift: "nightshift",
        manNumber: "S45678",
        isFlyer: false,
        flyerRole: "none",
        isSupport: true
      }
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
        name: currentUserName,
        isSupport: true // Ensure isSupport is set for current user
      });
    }
  }
  
  return supportProfiles;
};

// Find a profile by username (or manNumber)
export const findProfileByUsername = (username: string): UserProfile | null => {
  if (!username || username.trim() === '') {
    console.log("Empty username provided to findProfileByUsername");
    return null;
  }
  
  const trimmedUsername = username.trim().toLowerCase();
  console.log(`Finding profile for username: "${trimmedUsername}"`);
  
  // First check in the current user's profile
  const currentProfile = getUserProfile();
  if (currentProfile) {
    const currentManNumber = (currentProfile.manNumber || '').toLowerCase();
    const currentName = (currentProfile.name || '').toLowerCase();
    
    if (currentManNumber === trimmedUsername || 
        currentName.includes(trimmedUsername)) {
      console.log("Found matching profile in current user profile");
      return currentProfile;
    }
  }
  
  // Then check in all support profiles
  const supportProfiles = getAllSupportProfiles();
  console.log(`Checking ${supportProfiles.length} support profiles for username match`);
  
  const foundProfile = supportProfiles.find(profile => {
    const profileManNumber = (profile.manNumber || '').toLowerCase();
    const profileName = (profile.name || '').toLowerCase();
    
    return profileManNumber === trimmedUsername || 
           profileName.includes(trimmedUsername);
  });
  
  if (foundProfile) {
    console.log("Found matching profile in support profiles");
    return foundProfile;
  }
  
  // Also check in localStorage for any other profiles
  try {
    const allProfiles = localStorage.getItem("allUserProfiles");
    if (allProfiles) {
      const parsedProfiles = JSON.parse(allProfiles) as UserProfile[];
      console.log(`Checking ${parsedProfiles.length} stored profiles for username match`);
      
      const profile = parsedProfiles.find(p => {
        const pManNumber = (p.manNumber || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        
        return pManNumber === trimmedUsername || 
               pName.includes(trimmedUsername);
      });
      
      if (profile) {
        console.log("Found matching profile in stored profiles");
        return profile;
      }
    }
  } catch (e) {
    console.error("Error parsing stored profiles:", e);
  }
  
  console.log("No matching profile found for username:", username);
  return null;
};

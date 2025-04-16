
import { UserProfile } from "@/types/userSearch";

/**
 * Utility functions for profile management
 */

// Check if a profile exists with a given username across all storage mechanisms
export const checkForProfile = (username: string): {exists: boolean, profile?: any} => {
  console.log("Checking for profile with username:", username);
  
  // First check the user profile directly
  const currentProfile = localStorage.getItem("userProfile");
  if (currentProfile) {
    const parsedProfile = JSON.parse(currentProfile);
    if (parsedProfile.manNumber === username || parsedProfile.name?.includes(username)) {
      console.log("Found profile in userProfile:", parsedProfile);
      return { exists: true, profile: parsedProfile };
    }
  }
  
  // Then check all support profiles
  const supportProfiles = localStorage.getItem("supportProfiles");
  if (supportProfiles) {
    const parsedProfiles = JSON.parse(supportProfiles);
    const foundProfile = parsedProfiles.find(
      (profile: any) => profile.manNumber === username || profile.name?.includes(username)
    );
    
    if (foundProfile) {
      console.log("Found profile in supportProfiles:", foundProfile);
      return { exists: true, profile: foundProfile };
    }
  }
  
  // Check all stored user emails
  const verifiedEmails = localStorage.getItem("verifiedEmails");
  if (verifiedEmails) {
    const emails = JSON.parse(verifiedEmails);
    // If username is in the format of an email or a man number that's associated with an email
    const relatedEmail = emails.find((email: string) => 
      email.includes(username) || email.startsWith(`user${username}@`)
    );
    
    if (relatedEmail) {
      console.log("Found related email:", relatedEmail);
      return { exists: true, profile: { email: relatedEmail } };
    }
  }
  
  // Check in search cache if it exists
  const searchCache = localStorage.getItem("userSearchCache");
  if (searchCache) {
    try {
      const parsedCache = JSON.parse(searchCache);
      for (const key in parsedCache) {
        const results = parsedCache[key];
        const found = results.find((user: UserProfile) => 
          user.manNumber === username || 
          user.username?.includes(username) ||
          (user.email && user.email.includes(username))
        );
        
        if (found) {
          console.log("Found user in search cache:", found);
          return { exists: true, profile: found };
        }
      }
    } catch (e) {
      console.error("Error parsing search cache:", e);
    }
  }
  
  console.log("No profile found with username:", username);
  return { exists: false };
};

// Log all profiles for debugging purposes
export const logAllProfiles = () => {
  console.log("=== DEBUGGING PROFILES ===");
  
  // Log current user profile
  const currentProfile = localStorage.getItem("userProfile");
  console.log("Current User Profile:", currentProfile ? JSON.parse(currentProfile) : "Not set");
  
  // Log all support profiles
  const supportProfiles = localStorage.getItem("supportProfiles");
  console.log("Support Profiles:", supportProfiles ? JSON.parse(supportProfiles) : "None");
  
  // Log all verified emails
  const verifiedEmails = localStorage.getItem("verifiedEmails");
  console.log("Verified Emails:", verifiedEmails ? JSON.parse(verifiedEmails) : "None");
  
  // Log search cache
  const searchCache = localStorage.getItem("userSearchCache");
  console.log("User Search Cache:", searchCache ? "Available (see below)" : "None");
  if (searchCache) {
    try {
      const parsedCache = JSON.parse(searchCache);
      Object.keys(parsedCache).forEach(key => {
        console.log(`Results for "${key}":`, parsedCache[key]);
      });
    } catch (e) {
      console.error("Error parsing search cache:", e);
    }
  }
  
  console.log("=== END DEBUGGING PROFILES ===");
};

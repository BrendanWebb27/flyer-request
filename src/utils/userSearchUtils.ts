
import { UserProfile } from "@/types/userSearch";
import { mockUsers } from "@/data/mockUsers";
import { getVerifiedEmails, getEmailOrganization } from "@/utils/userDataExpiration";
import { isValidDomain } from "@/utils/organizationVerification";

// API timeout configuration
export const API_TIMEOUT = 8000; // 8 seconds
export const MOCK_API_DELAY = 500; // 0.5 seconds for mock API

// Extract man number from username (format: "##### Name")
export function extractManNumber(query: string): string | null {
  const match = query.match(/^(\d{5})\s+/);
  return match ? match[1] : null;
}

// Helper function to simulate the search logic that would happen server-side
export function performMockSearch(query: string): UserProfile[] {
  const trimmedQuery = query.trim().toLowerCase();
  const verifiedEmails = getVerifiedEmails();
  
  console.log(`Performing mock search for query: "${trimmedQuery}"`);
  
  // Check if it's a username search with embedded man number (##### Name)
  const extractedManNumber = extractManNumber(trimmedQuery);
  
  // First check if the query matches or partially matches a username
  const usernameMatch = mockUsers.find(user => 
    user.username.toLowerCase() === trimmedQuery ||
    user.username.toLowerCase().includes(trimmedQuery)
  );
  
  if (usernameMatch) {
    console.log("Found user match by username:", usernameMatch);
    // Use the matched user's data
    return [{ 
      email: usernameMatch.email,
      organization: usernameMatch.organization || "36 FGS",
      isVerified: verifiedEmails.includes(usernameMatch.email),
      username: usernameMatch.username,
      // Add these fields to ensure compatibility with UserProfile type
      manNumber: usernameMatch.manNumber || `AF${extractedManNumber || '00000'}`,
      workShift: "dayshift", // Default value
      isFlyer: false, // Default value
      flyerRole: "none", // Default value
      isSupport: false // Default value
    }];
  }
  else if (extractedManNumber) {
    // Handle username search with man number
    const username = trimmedQuery;
    console.log("Extracted man number from query:", extractedManNumber);
    
    // Check if this username matches any in our mock database
    const matchedUser = mockUsers.find(user => user.username.toLowerCase().includes(extractedManNumber.toLowerCase()));
    
    if (matchedUser) {
      console.log("Found user with matching man number in mock database:", matchedUser);
      // Use the matched user's data
      return [{ 
        email: matchedUser.email,
        organization: matchedUser.organization || "36 FGS",
        isVerified: verifiedEmails.includes(matchedUser.email),
        username: matchedUser.username,
        // Add these fields to ensure compatibility with UserProfile type
        manNumber: matchedUser.manNumber || `AF${extractedManNumber}`,
        workShift: "dayshift", // Default value
        isFlyer: false, // Default value
        flyerRole: "none", // Default value
        isSupport: false // Default value
      }];
    } else {
      console.log("Creating new user profile with extracted man number");
      // Create a result with the extracted data
      const associatedEmail = `user${extractedManNumber}@us.af.mil`;
      
      return [{ 
        email: associatedEmail,
        organization: "36 FGS",
        isVerified: verifiedEmails.includes(associatedEmail),
        username: username,
        // Add these fields to ensure compatibility with UserProfile type
        manNumber: `AF${extractedManNumber}`,
        workShift: "dayshift", // Default value
        isFlyer: false, // Default value
        flyerRole: "none", // Default value
        isSupport: false // Default value
      }];
    }
  }
  // Check if it's an email search
  else if (trimmedQuery.includes('@')) {
    const isValidEmail = isValidDomain(trimmedQuery);
    const isAlreadyVerified = verifiedEmails.includes(trimmedQuery);
    console.log(`Email search: ${trimmedQuery}, valid: ${isValidEmail}, verified: ${isAlreadyVerified}`);
    
    // Try to find a username match for this email
    const matchedUser = mockUsers.find(user => user.email.toLowerCase() === trimmedQuery);
    
    if (isValidEmail) {
      return [{ 
        email: trimmedQuery, 
        organization: isAlreadyVerified 
          ? getEmailOrganization(trimmedQuery) || "36 FGS"
          : "36 FGS",
        isVerified: isAlreadyVerified || Math.random() > 0.3, // Verified if in our records, otherwise 70% chance
        username: matchedUser?.username || undefined,
        // Add these fields to ensure compatibility with UserProfile type
        manNumber: matchedUser?.manNumber || `AF${Math.floor(10000 + Math.random() * 90000)}`,
        workShift: "dayshift", // Default value
        isFlyer: false, // Default value
        flyerRole: "none", // Default value
        isSupport: false // Default value
      }];
    }
    
    throw new Error(`No verified user found with email: ${trimmedQuery}`);
  } 
  // Check if it's a search by man number without AF prefix
  else if (/^\d+$/.test(trimmedQuery)) {
    const manNumber = trimmedQuery;
    console.log("Searching by man number:", manNumber);
    
    // Try to find a username match for this man number
    const matchedUser = mockUsers.find(user => 
      user.manNumber === `AF${manNumber}` || 
      user.username.startsWith(manNumber)
    );
    
    if (matchedUser) {
      console.log("Found user with matching man number:", matchedUser);
      return [{ 
        email: matchedUser.email,
        organization: matchedUser.organization || "36 FGS",
        isVerified: verifiedEmails.includes(matchedUser.email),
        username: matchedUser.username,
        // Add these fields to ensure compatibility with UserProfile type
        manNumber: matchedUser.manNumber || `AF${manNumber}`,
        workShift: "dayshift", // Default value
        isFlyer: false, // Default value
        flyerRole: "none", // Default value
        isSupport: false // Default value
      }];
    }
    
    throw new Error("No user found with that man number");
  }
  
  throw new Error("Please enter a valid email, man number, or username (##### Name)");
}

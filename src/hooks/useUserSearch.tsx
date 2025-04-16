
import { useState, useEffect } from "react";
import { getVerifiedEmails, getEmailOrganization } from "@/utils/userDataExpiration";
import { isValidDomain, isValidCode } from "@/utils/organizationVerification";

export interface UserProfile {
  email: string;
  manNumber?: string;
  organization?: string;
  isVerified: boolean;
  verificationCode?: string;
  username?: string;
}

// Mock user database for autocomplete
const mockUsers = [
  { username: "12345 John Smith", email: "john.smith@us.af.mil", manNumber: "AF12345", organization: "36 FGS" },
  { username: "23456 Jane Doe", email: "jane.doe@us.af.mil", manNumber: "AF23456", organization: "36 FGS" },
  { username: "34567 Robert Johnson", email: "robert.johnson@us.af.mil", manNumber: "AF34567", organization: "36th Fighter Generation Squadron" },
  { username: "45678 Lisa Brown", email: "lisa.brown@us.af.mil", manNumber: "AF45678", organization: "36 FGS" },
  { username: "56789 Michael Wilson", email: "michael.wilson@us.af.mil", manNumber: "AF56789", organization: "36 FGS" },
  { username: "67890 Sarah Davis", email: "sarah.davis@us.af.mil", manNumber: "AF67890", organization: "36th Fighter Generation Squadron" },
  { username: "78901 David Miller", email: "david.miller@us.af.mil", manNumber: "AF78901", organization: "36 FGS" },
  { username: "89012 Jennifer Taylor", email: "jennifer.taylor@us.af.mil", manNumber: "AF89012", organization: "36 FGS" },
];

export function useUserSearch(setError: (error: string) => void) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{username: string, email: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedEmails, setVerifiedEmails] = useState<string[]>([]);

  // Load verified emails on mount
  useEffect(() => {
    setVerifiedEmails(getVerifiedEmails());
  }, []);
  
  // Extract man number from username (format: "##### Name")
  const extractManNumber = (query: string): string | null => {
    const match = query.match(/^(\d{5})\s+/);
    return match ? match[1] : null;
  };
  
  // Function to handle searching for users
  const performSearch = (query: string) => {
    setIsSearching(true);
    setError("");
    
    // Simulate API call to search for users
    setTimeout(() => {
      const trimmedQuery = query.trim();
      
      // Check if it's a username search with embedded man number (##### Name)
      const extractedManNumber = extractManNumber(trimmedQuery);
      
      if (extractedManNumber) {
        // Handle username search with man number
        const username = trimmedQuery;
        
        // Check if this username matches any in our mock database
        const matchedUser = mockUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
        
        if (matchedUser) {
          // Use the matched user's data
          const mockResults: UserProfile[] = [{ 
            email: matchedUser.email,
            organization: matchedUser.organization || "36 FGS",
            isVerified: verifiedEmails.includes(matchedUser.email),
            username: matchedUser.username
          }];
          
          setSearchResults(mockResults);
        } else {
          // Create a result with the extracted data
          const associatedEmail = `user${extractedManNumber}@us.af.mil`;
          
          const mockResults: UserProfile[] = [{ 
            email: associatedEmail,
            organization: "36 FGS",
            isVerified: verifiedEmails.includes(associatedEmail),
            username: username
          }];
          
          setSearchResults(mockResults);
        }
      }
      // Check if it's an email search
      else if (trimmedQuery.includes('@')) {
        const isValidEmail = isValidDomain(trimmedQuery);
        const isAlreadyVerified = verifiedEmails.includes(trimmedQuery);
        
        // Try to find a username match for this email
        const matchedUser = mockUsers.find(user => user.email.toLowerCase() === trimmedQuery.toLowerCase());
        
        const mockResults: UserProfile[] = isValidEmail 
          ? [
              { 
                email: trimmedQuery, 
                organization: isAlreadyVerified 
                  ? getEmailOrganization(trimmedQuery) || "36 FGS"
                  : "36 FGS",
                isVerified: isAlreadyVerified || Math.random() > 0.3, // Verified if in our records, otherwise 70% chance
                username: matchedUser?.username || undefined
              }
            ]
          : [];
        
        if (mockResults.length === 0) {
          setError(`No verified user found with email: ${trimmedQuery}`);
        }
        setSearchResults(mockResults);
      } 
      // Check if it's a search by man number without AF prefix
      else if (/^\d+$/.test(trimmedQuery)) {
        const manNumber = trimmedQuery;
        
        // Try to find a username match for this man number
        const matchedUser = mockUsers.find(user => 
          user.manNumber === `AF${manNumber}` || 
          user.username.startsWith(manNumber)
        );
        
        if (matchedUser) {
          const mockResults: UserProfile[] = [
            { 
              email: matchedUser.email,
              organization: matchedUser.organization || "36 FGS",
              isVerified: verifiedEmails.includes(matchedUser.email),
              username: matchedUser.username
            }
          ];
          setSearchResults(mockResults);
        } else {
          setError("No user found with that man number");
          setSearchResults([]);
        }
      } else {
        setError("Please enter a valid email, man number, or username (##### Name)");
        setSearchResults([]);
      }
      
      setIsSearching(false);
    }, 500);
  };

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = mockUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);
  
  // Function to verify a user's organization code
  const verifyUserOrganization = (user: UserProfile): boolean => {
    if (!user.verificationCode) return false;
    return isValidCode(user.verificationCode);
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: {username: string, email: string}, setQuery?: (query: string) => void) => {
    if (setQuery) {
      setQuery(suggestion.username);
    }
    
    // Auto-search with the selected suggestion
    performSearch(suggestion.username);
  };

  return {
    searchResults,
    suggestions,
    isSearching,
    performSearch,
    handleSelectSuggestion
  };
}

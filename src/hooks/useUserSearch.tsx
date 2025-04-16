
import { useState, useEffect } from "react";
import { getVerifiedEmails, getEmailOrganization } from "@/utils/userDataExpiration";
import { isValidDomain, isValidCode } from "@/utils/organizationVerification";
import { toast } from "@/components/ui/use-toast";

// API timeout configuration
const API_TIMEOUT = 8000; // 8 seconds
const MOCK_API_DELAY = 500; // 0.5 seconds for mock API

export interface UserProfile {
  email: string;
  manNumber?: string;
  organization?: string;
  isVerified: boolean;
  verificationCode?: string;
  username?: string;
}

// Mock user database for autocomplete
// In a real application, this would be fetched from an API
const mockUsers = [
  { username: "12345 John Smith", email: "john.smith@us.af.mil", manNumber: "AF12345", organization: "36 FGS" },
  { username: "23456 Jane Doe", email: "jane.doe@us.af.mil", manNumber: "AF23456", organization: "36 FGS" },
  { username: "34567 Robert Johnson", email: "robert.johnson@us.af.mil", manNumber: "AF34567", organization: "36th Fighter Generation Squadron" },
  { username: "45678 Lisa Brown", email: "lisa.brown@us.af.mil", manNumber: "AF45678", organization: "36 FGS" },
  { username: "56789 Michael Wilson", email: "michael.wilson@us.af.mil", manNumber: "AF56789", organization: "36 FGS" },
  { username: "67890 Sarah Davis", email: "sarah.davis@us.af.mil", manNumber: "AF67890", organization: "36th Fighter Generation Squadron" },
  { username: "78901 David Miller", email: "david.miller@us.af.mil", manNumber: "AF78901", organization: "36 FGS" },
  { username: "89012 Jennifer Taylor", email: "jennifer.taylor@us.af.mil", manNumber: "AF89012", organization: "36 FGS" },
  { username: "04074 SSgt Webb", email: "brendan.webb@us.af.mil", manNumber: "AF04074", organization: "36 FGS" },
];

// Abstract the API calls for better maintainability
const userSearchApi = {
  // Search for users by various criteria
  searchUsers: async (query: string): Promise<UserProfile[]> => {
    // Simulate API call with a timeout for error handling demonstration
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Search request timed out. Please try again."));
      }, API_TIMEOUT);

      // Simulate successful API response
      setTimeout(() => {
        clearTimeout(timeoutId);
        
        try {
          const results = performMockSearch(query);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      }, MOCK_API_DELAY);
    });
  },

  // Get user suggestions for autocomplete
  getSuggestions: async (query: string): Promise<Array<{username: string, email: string}>> => {
    // In a real app, this would be a separate API call with pagination
    if (query.trim().length <= 1) return [];
    
    return mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  // Verify a user's organization code - would be a separate endpoint in real API
  verifyOrganizationCode: async (verificationCode: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(isValidCode(verificationCode));
      }, 300);
    });
  }
};

// Helper function to simulate the search logic that would happen server-side
function performMockSearch(query: string): UserProfile[] {
  const trimmedQuery = query.trim().toLowerCase();
  const verifiedEmails = getVerifiedEmails();
  
  // Check if it's a username search with embedded man number (##### Name)
  const extractedManNumber = extractManNumber(trimmedQuery);
  
  // First check if the query matches or partially matches a username
  const usernameMatch = mockUsers.find(user => 
    user.username.toLowerCase() === trimmedQuery ||
    user.username.toLowerCase().includes(trimmedQuery)
  );
  
  if (usernameMatch) {
    // Use the matched user's data
    return [{ 
      email: usernameMatch.email,
      organization: usernameMatch.organization || "36 FGS",
      isVerified: verifiedEmails.includes(usernameMatch.email),
      username: usernameMatch.username
    }];
  }
  else if (extractedManNumber) {
    // Handle username search with man number
    const username = trimmedQuery;
    
    // Check if this username matches any in our mock database
    const matchedUser = mockUsers.find(user => user.username.toLowerCase().includes(extractedManNumber.toLowerCase()));
    
    if (matchedUser) {
      // Use the matched user's data
      return [{ 
        email: matchedUser.email,
        organization: matchedUser.organization || "36 FGS",
        isVerified: verifiedEmails.includes(matchedUser.email),
        username: matchedUser.username
      }];
    } else {
      // Create a result with the extracted data
      const associatedEmail = `user${extractedManNumber}@us.af.mil`;
      
      return [{ 
        email: associatedEmail,
        organization: "36 FGS",
        isVerified: verifiedEmails.includes(associatedEmail),
        username: username
      }];
    }
  }
  // Check if it's an email search
  else if (trimmedQuery.includes('@')) {
    const isValidEmail = isValidDomain(trimmedQuery);
    const isAlreadyVerified = verifiedEmails.includes(trimmedQuery);
    
    // Try to find a username match for this email
    const matchedUser = mockUsers.find(user => user.email.toLowerCase() === trimmedQuery);
    
    if (isValidEmail) {
      return [{ 
        email: trimmedQuery, 
        organization: isAlreadyVerified 
          ? getEmailOrganization(trimmedQuery) || "36 FGS"
          : "36 FGS",
        isVerified: isAlreadyVerified || Math.random() > 0.3, // Verified if in our records, otherwise 70% chance
        username: matchedUser?.username || undefined
      }];
    }
    
    throw new Error(`No verified user found with email: ${trimmedQuery}`);
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
      return [{ 
        email: matchedUser.email,
        organization: matchedUser.organization || "36 FGS",
        isVerified: verifiedEmails.includes(matchedUser.email),
        username: matchedUser.username
      }];
    }
    
    throw new Error("No user found with that man number");
  }
  
  throw new Error("Please enter a valid email, man number, or username (##### Name)");
}

// Extract man number from username (format: "##### Name")
function extractManNumber(query: string): string | null {
  const match = query.match(/^(\d{5})\s+/);
  return match ? match[1] : null;
}

// The main hook
export function useUserSearch(setError: (error: string) => void) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{username: string, email: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedEmails, setVerifiedEmails] = useState<string[]>([]);

  // Cache for recently searched results to improve performance
  const [searchCache, setSearchCache] = useState<Record<string, UserProfile[]>>({});
  
  // Controller for aborting fetch requests when component unmounts
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Load verified emails on mount
  useEffect(() => {
    setVerifiedEmails(getVerifiedEmails());
  }, []);
  
  // Clean up any pending requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);
  
  // Function to handle searching for users with better error handling
  const performSearch = async (query: string) => {
    // Trim query to avoid unnecessary searches
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("Please enter a search term");
      return;
    }

    // Check cache first
    if (searchCache[trimmedQuery]) {
      setSearchResults(searchCache[trimmedQuery]);
      return;
    }
    
    // If there's an ongoing search, abort it
    if (abortController) {
      abortController.abort();
    }
    
    // Create a new abort controller for this search
    const newController = new AbortController();
    setAbortController(newController);
    
    setIsSearching(true);
    setError("");
    
    try {
      // Perform the search
      const results = await userSearchApi.searchUsers(trimmedQuery);
      
      // Cache the results
      setSearchCache(prev => ({
        ...prev,
        [trimmedQuery]: results
      }));
      
      setSearchResults(results);
    } catch (error) {
      // If the error is an abort error, don't set an error message
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Search aborted');
        return;
      }
      
      // Handle other errors
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      setSearchResults([]);
      
      // Show a toast for critical errors
      if (!(error instanceof Error) || !error.message.includes("No verified user")) {
        toast({
          title: "Search Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSearching(false);
      setAbortController(null);
    }
  };

  // Update suggestions asynchronously when search query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const suggestions = await userSearchApi.getSuggestions(searchQuery);
          setSuggestions(suggestions);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Function to verify a user's organization code
  const verifyUserOrganization = async (user: UserProfile): Promise<boolean> => {
    if (!user.verificationCode) return false;
    
    try {
      return await userSearchApi.verifyOrganizationCode(user.verificationCode);
    } catch (error) {
      console.error("Error verifying organization code:", error);
      toast({
        title: "Verification Error",
        description: "Failed to verify organization code. Please try again.",
        variant: "destructive",
      });
      return false;
    }
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
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    performSearch,
    handleSelectSuggestion,
    verifyUserOrganization
  };
}

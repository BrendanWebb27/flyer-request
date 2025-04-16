
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { userSearchApi } from "@/services/userSearchApi";
import { getVerifiedEmails } from "@/utils/userDataExpiration";
import { UserProfile, UserSuggestion, UserSearchHookResult } from "@/types/userSearch";

/**
 * Custom hook for user search functionality
 */
export function useUserSearch(setError: (error: string) => void): UserSearchHookResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
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
  const handleSelectSuggestion = (suggestion: UserSuggestion, setQuery?: (query: string) => void) => {
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

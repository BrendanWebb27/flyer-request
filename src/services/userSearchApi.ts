
import { UserProfile, UserSuggestion } from "@/types/userSearch";
import { mockUsers } from "@/data/mockUsers";
import { performMockSearch, API_TIMEOUT, MOCK_API_DELAY } from "@/utils/userSearchUtils";
import { isValidCode } from "@/utils/organizationVerification";

// Abstract the API calls for better maintainability
export const userSearchApi = {
  // Search for users by various criteria
  searchUsers: async (query: string): Promise<UserProfile[]> => {
    console.log("API: Searching for users with query:", query);
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
          console.log(`API: Found ${results.length} results for query:`, query);
          
          // Cache search results for future reference
          try {
            const searchCache = JSON.parse(localStorage.getItem("userSearchCache") || "{}");
            searchCache[query] = results;
            localStorage.setItem("userSearchCache", JSON.stringify(searchCache));
          } catch (e) {
            console.error("Error caching search results:", e);
          }
          
          resolve(results);
        } catch (error) {
          console.error("API: Search error:", error);
          reject(error);
        }
      }, MOCK_API_DELAY);
    });
  },

  // Get user suggestions for autocomplete
  getSuggestions: async (query: string): Promise<UserSuggestion[]> => {
    // In a real app, this would be a separate API call with pagination
    if (query.trim().length <= 1) return [];
    
    console.log("API: Getting suggestions for query:", query);
    
    // First check cache for faster responses
    try {
      const searchCache = JSON.parse(localStorage.getItem("userSearchCache") || "{}");
      for (const key in searchCache) {
        if (key.includes(query) || query.includes(key)) {
          console.log(`API: Found cached suggestions for similar query: ${key}`);
          return searchCache[key].map((user: UserProfile) => ({
            username: user.username || user.email.split('@')[0],
            email: user.email
          }));
        }
      }
    } catch (e) {
      console.error("Error processing search cache:", e);
    }
    
    // Get suggestions from mock users
    const suggestions = mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log("API: Found suggestions:", suggestions.length);
    return suggestions;
  },
  
  // Verify a user's organization code - would be a separate endpoint in real API
  verifyOrganizationCode: async (verificationCode: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = isValidCode(verificationCode);
        console.log("API: Verifying code:", verificationCode, "Valid:", isValid);
        resolve(isValid);
      }, 300);
    });
  }
};

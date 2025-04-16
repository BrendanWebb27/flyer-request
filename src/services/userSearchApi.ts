
import { UserProfile, UserSuggestion } from "@/types/userSearch";
import { mockUsers } from "@/data/mockUsers";
import { performMockSearch, API_TIMEOUT, MOCK_API_DELAY } from "@/utils/userSearchUtils";
import { isValidCode } from "@/utils/organizationVerification";

// Abstract the API calls for better maintainability
export const userSearchApi = {
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
  getSuggestions: async (query: string): Promise<UserSuggestion[]> => {
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

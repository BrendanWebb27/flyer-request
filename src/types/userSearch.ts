
// Define user-related types that will be shared across components
export interface UserProfile {
  email: string;
  manNumber?: string;
  organization?: string;
  isVerified: boolean;
  verificationCode?: string;
  username?: string;
}

export interface UserSuggestion {
  username: string;
  email: string;
}

export interface UserSearchHookResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: UserProfile[];
  suggestions: UserSuggestion[];
  isSearching: boolean;
  performSearch: (query: string) => void;
  handleSelectSuggestion: (suggestion: UserSuggestion, setQuery?: (query: string) => void) => void;
  verifyUserOrganization?: (user: UserProfile) => Promise<boolean>;
}

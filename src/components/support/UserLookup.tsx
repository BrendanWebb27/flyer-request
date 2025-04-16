
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserSearchResults from "@/components/support/UserSearchResults";
import UserSuggestions from "@/components/support/UserSuggestions";
import { useUserSearch } from "@/hooks/useUserSearch";
import type { UserProfile } from "@/hooks/useUserSearch";

interface UserLookupProps {
  onUserSelect?: (user: UserProfile) => void;
}

const UserLookup: React.FC<UserLookupProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { 
    suggestions, 
    searchResults, 
    isSearching, 
    performSearch,
    handleSelectSuggestion
  } = useUserSearch(setError);
  
  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, suggestions]);

  // Handle search function
  const handleSearch = () => {
    setShowSuggestions(false);
    performSearch(searchQuery);
  };
  
  // Clear search field
  const clearSearch = () => {
    setSearchQuery("");
    setError("");
    setShowSuggestions(false);
  };
  
  // Handle selection of a suggestion
  const handleSuggestionSelect = (suggestion: {username: string, email: string}) => {
    handleSelectSuggestion(suggestion, setSearchQuery);
    setShowSuggestions(false);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">User Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search by username (##### Name), email, or man number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery}
                className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
            
            {/* Suggestions dropdown */}
            {showSuggestions && (
              <UserSuggestions 
                suggestions={suggestions} 
                onSelect={handleSuggestionSelect} 
              />
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 flex items-center gap-1 text-sm">
              <Search size={16} className="text-red-500" />
              {error}
            </div>
          )}
          
          {/* Search results */}
          {searchResults.length > 0 && (
            <UserSearchResults 
              results={searchResults} 
              onSelect={onUserSelect}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLookup;

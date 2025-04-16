
import React, { useState, useEffect, useMemo } from "react";
import { Search, UserCheck, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidDomain, isValidCode, getAllOrganizations } from "@/utils/organizationVerification";
import { Badge } from "@/components/ui/badge";
import { getVerifiedEmails, getEmailOrganization } from "@/utils/userDataExpiration";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserLookupProps {
  onUserSelect?: (user: UserProfile) => void;
}

interface UserProfile {
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

const UserLookup: React.FC<UserLookupProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{username: string, email: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [verifiedEmails, setVerifiedEmails] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Load verified emails on component mount
  useEffect(() => {
    setVerifiedEmails(getVerifiedEmails());
  }, []);
  
  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = mockUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);
  
  // Extract man number from username (format: "##### Name")
  const extractManNumber = (query: string): string | null => {
    const match = query.match(/^(\d{5})\s+/);
    return match ? match[1] : null;
  };
  
  // Function to handle searching for users
  const handleSearch = () => {
    setIsSearching(true);
    setError("");
    setShowSuggestions(false);
    
    // Simulate API call to search for users
    setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      
      // Check if it's a username search with embedded man number (##### Name)
      const extractedManNumber = extractManNumber(trimmedQuery);
      
      if (extractedManNumber) {
        // Handle username search with man number
        const username = trimmedQuery;
        const manNumber = extractedManNumber;
        
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
  
  // Function to verify a user's organization code
  const verifyUserOrganization = (user: UserProfile): boolean => {
    if (!user.verificationCode) return false;
    return isValidCode(user.verificationCode);
  };
  
  // Select a suggestion
  const handleSelectSuggestion = (suggestion: {username: string, email: string}) => {
    setSearchQuery(suggestion.username);
    setShowSuggestions(false);
  };
  
  // Clear search field
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError("");
    setSuggestions([]);
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
              <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                <ScrollArea className="h-full max-h-60">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="font-medium">{suggestion.username}</div>
                      <div className="text-sm text-gray-500">{suggestion.email}</div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 flex items-center gap-1 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((user, index) => {
                const isVerified = user.isVerified || verifyUserOrganization(user);
                
                return (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{user.email}</h3>
                          <Badge className={isVerified ? "bg-green-500" : "bg-amber-500"}>
                            {isVerified ? "Verified" : "Not Verified"}
                          </Badge>
                        </div>
                        
                        {user.username && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Username:</strong> {user.username}
                          </div>
                        )}
                        
                        {user.organization && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Organization:</strong> {user.organization}
                          </div>
                        )}
                        
                        {isVerified ? (
                          <div className="flex items-center text-green-600 text-sm mt-1">
                            <UserCheck className="h-4 w-4 mr-1" />
                            User has valid organization access
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 text-sm mt-1">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            User doesn't have valid organization verification
                          </div>
                        )}
                        
                        {onUserSelect && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => onUserSelect(user)}
                          >
                            View Full Profile
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLookup;

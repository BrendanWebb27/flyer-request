
import React, { useState } from "react";
import { Search, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidDomain, isValidCode } from "@/utils/organizationVerification";
import { Badge } from "@/components/ui/badge";

interface UserLookupProps {
  onUserSelect?: (user: UserProfile) => void;
}

interface UserProfile {
  email: string;
  manNumber?: string;
  organization?: string;
  isVerified: boolean;
  verificationCode?: string;
}

const UserLookup: React.FC<UserLookupProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  
  // Function to handle searching for users
  const handleSearch = () => {
    setIsSearching(true);
    setError("");
    
    // Simulate API call to search for users
    setTimeout(() => {
      // Check if it's an email search
      if (searchQuery.includes('@')) {
        const isValidEmail = isValidDomain(searchQuery);
        const mockResults: UserProfile[] = isValidEmail 
          ? [
              { 
                email: searchQuery, 
                manNumber: "AF" + Math.floor(10000 + Math.random() * 90000),
                organization: "Air Force Operations",
                isVerified: Math.random() > 0.3, // 70% chance of being verified
                verificationCode: "ORG002-FLYER"
              }
            ]
          : [];
        
        if (mockResults.length === 0) {
          setError(`No verified user found with email: ${searchQuery}`);
        }
        setSearchResults(mockResults);
      } 
      // Check if it's a search by man number
      else if (searchQuery.startsWith("AF") || /^\d+$/.test(searchQuery)) {
        const manNumber = searchQuery.startsWith("AF") ? searchQuery : "AF" + searchQuery;
        const mockResults: UserProfile[] = [
          { 
            email: `user${Math.floor(1000 + Math.random() * 9000)}@us.af.mil`, 
            manNumber: manNumber,
            organization: "Air Force HQ",
            isVerified: Math.random() > 0.2, // 80% chance of being verified
            verificationCode: "ORG001-FLYER"
          }
        ];
        
        setSearchResults(mockResults);
      } else {
        setError("Please enter a valid email or man number");
        setSearchResults([]);
      }
      
      setIsSearching(false);
    }, 800);
  };
  
  // Function to verify a user's organization code
  const verifyUserOrganization = (user: UserProfile): boolean => {
    if (!user.verificationCode) return false;
    return isValidCode(user.verificationCode);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">User Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by email or man number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
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
          
          {error && (
            <div className="text-red-500 flex items-center gap-1 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((user, index) => {
                const isVerified = verifyUserOrganization(user);
                
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
                        
                        {user.manNumber && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Man Number:</strong> {user.manNumber}
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

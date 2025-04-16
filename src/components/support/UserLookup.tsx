
import React, { useState, useEffect } from "react";
import { Search, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidDomain, isValidCode } from "@/utils/organizationVerification";
import { Badge } from "@/components/ui/badge";
import { getVerifiedEmails, getEmailOrganization } from "@/utils/userDataExpiration";

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

const UserLookup: React.FC<UserLookupProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [verifiedEmails, setVerifiedEmails] = useState<string[]>([]);
  
  // Load verified emails on component mount
  useEffect(() => {
    setVerifiedEmails(getVerifiedEmails());
  }, []);
  
  // Extract man number from username (format: "##### Name")
  const extractManNumber = (query: string): string | null => {
    const match = query.match(/^(\d{5})\s+/);
    return match ? match[1] : null;
  };
  
  // Function to handle searching for users
  const handleSearch = () => {
    setIsSearching(true);
    setError("");
    
    // Simulate API call to search for users
    setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      
      // Check if it's a username search with embedded man number (##### Name)
      const extractedManNumber = extractManNumber(trimmedQuery);
      
      if (extractedManNumber) {
        // Handle username search with man number
        const username = trimmedQuery;
        const manNumber = "AF" + extractedManNumber;
        
        // Check if this man number is associated with a verified email
        const associatedEmail = findVerifiedEmailByManNumber(manNumber);
        
        const mockResults: UserProfile[] = [{ 
          email: associatedEmail || `user${extractedManNumber}@us.af.mil`,
          manNumber: manNumber,
          organization: associatedEmail ? getEmailOrganization(associatedEmail) || "Air Force HQ" : "Air Force HQ",
          isVerified: !!associatedEmail,
          verificationCode: "ORG001-FLYER",
          username: username
        }];
        
        setSearchResults(mockResults);
      }
      // Check if it's an email search
      else if (trimmedQuery.includes('@')) {
        const isValidEmail = isValidDomain(trimmedQuery);
        const isAlreadyVerified = verifiedEmails.includes(trimmedQuery);
        
        const mockResults: UserProfile[] = isValidEmail 
          ? [
              { 
                email: trimmedQuery, 
                manNumber: "AF" + Math.floor(10000 + Math.random() * 90000),
                organization: isAlreadyVerified 
                  ? getEmailOrganization(trimmedQuery) || "Air Force Operations"
                  : "Air Force Operations",
                isVerified: isAlreadyVerified || Math.random() > 0.3, // Verified if in our records, otherwise 70% chance
                verificationCode: "ORG002-FLYER"
              }
            ]
          : [];
        
        if (mockResults.length === 0) {
          setError(`No verified user found with email: ${trimmedQuery}`);
        }
        setSearchResults(mockResults);
      } 
      // Check if it's a search by man number
      else if (trimmedQuery.startsWith("AF") || /^\d+$/.test(trimmedQuery)) {
        const manNumber = trimmedQuery.startsWith("AF") ? trimmedQuery : "AF" + trimmedQuery;
        
        // Check if this man number is associated with a verified email
        const associatedEmail = findVerifiedEmailByManNumber(manNumber);
        
        const mockResults: UserProfile[] = [
          { 
            email: associatedEmail || `user${manNumber.replace("AF", "")}@us.af.mil`,
            manNumber: manNumber,
            organization: associatedEmail ? getEmailOrganization(associatedEmail) || "Air Force HQ" : "Air Force HQ",
            isVerified: !!associatedEmail || Math.random() > 0.2, // Verified if we have an email, otherwise 80% chance
            verificationCode: "ORG001-FLYER"
          }
        ];
        
        setSearchResults(mockResults);
      } else {
        setError("Please enter a valid email, man number, or username (##### Name)");
        setSearchResults([]);
      }
      
      setIsSearching(false);
    }, 800);
  };
  
  // Function to find a verified email associated with a man number
  // In a real app, this would query a database
  const findVerifiedEmailByManNumber = (manNumber: string): string | null => {
    // This is mock functionality - in a real app we'd check a database
    // For now, we'll just use a deterministic approach based on the man number
    
    // Simulate that some man numbers have verified emails
    const manNumberDigits = manNumber.replace("AF", "");
    const lastDigit = parseInt(manNumberDigits.slice(-1));
    
    if (lastDigit % 3 === 0 && verifiedEmails.length > 0) {
      // For demonstration purposes, return a verified email if available
      return verifiedEmails[lastDigit % verifiedEmails.length];
    }
    
    return null;
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
                placeholder="Search by email, man number, or username (##### Name)"
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

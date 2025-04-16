
import React from "react";
import { UserCheck, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserProfile {
  email: string;
  manNumber?: string;
  organization?: string;
  isVerified: boolean;
  verificationCode?: string;
  username?: string;
}

interface UserSearchResultsProps {
  results: UserProfile[];
  onSelect?: (user: UserProfile) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ results, onSelect }) => {
  return (
    <div className="space-y-4">
      {results.map((user, index) => {
        const isVerified = user.isVerified;
        
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
                
                {onSelect && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => onSelect(user)}
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
  );
};

export default UserSearchResults;

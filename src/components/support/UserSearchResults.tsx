
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/userSearch";
import { Badge } from "@/components/ui/badge";

interface UserSearchResultsProps {
  results: UserProfile[];
  onSelect?: (user: UserProfile) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ results, onSelect }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Found {results.length} {results.length === 1 ? 'result' : 'results'}
      </h3>
      
      {results.map((user, index) => (
        <Card key={index} className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{user.email}</h3>
                {user.isVerified && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Verified
                  </Badge>
                )}
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
              
              {user.manNumber && (
                <div className="text-sm text-muted-foreground">
                  <strong>Man Number:</strong> {user.manNumber}
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
      ))}
    </div>
  );
};

export default UserSearchResults;

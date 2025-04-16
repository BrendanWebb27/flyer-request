
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/userSearch";

interface UserSearchResultsProps {
  results: UserProfile[];
  onSelect?: (user: UserProfile) => void;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ results, onSelect }) => {
  return (
    <div className="space-y-4">
      {results.map((user, index) => (
        <Card key={index} className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{user.email}</h3>
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

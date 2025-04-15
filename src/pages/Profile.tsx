
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { User, Building2, Clock } from "lucide-react";

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user profile data
  const [profile, setProfile] = useState({
    manNumber: "12345",
    organization: "IT Department",
    workShift: "dayshift",
    isFlyer: true,
    flyerRole: "primary",
    isSupport: true // Mock support status for demonstration
  });

  const handleSaveProfile = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully."
      });
    }, 500);
  };

  const organizations = [
    "IT Department", 
    "Human Resources", 
    "Finance", 
    "Marketing", 
    "Operations", 
    "Customer Service",
    "Executive Office"
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Manage your account details and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-flyerPurple-100 flex items-center justify-center">
                <User size={48} className="text-flyerPurple-600" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <Label className="text-base font-medium">Man Number: {profile.manNumber}</Label>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                  <Building2 size={14} className="text-flyerPurple-500" />
                  <span>{profile.organization}</span>
                </div>
                
                <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm">
                  <Clock size={14} className="text-flyerPurple-500" />
                  <span className="capitalize">{profile.workShift}</span>
                </div>
                
                {profile.isSupport && profile.isFlyer && (
                  <div className="flex items-center gap-1 bg-flyerPurple-100 text-flyerPurple-700 px-3 py-1 rounded-full text-sm font-medium">
                    Flyer {profile.flyerRole === "primary" ? "Primary" : "Alternate"}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manNumber">Man Number & Name</Label>
              <Input 
                id="manNumber" 
                value={profile.manNumber} 
                onChange={(e) => setProfile({...profile, manNumber: e.target.value})}
                disabled={!isEditing} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              {isEditing ? (
                <Select 
                  defaultValue={profile.organization}
                  onValueChange={(value) => setProfile({...profile, organization: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org} value={org}>{org}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id="organization" value={profile.organization} disabled />
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Work Shift</Label>
              <ToggleGroup 
                type="single" 
                variant="outline" 
                disabled={!isEditing}
                value={profile.workShift}
                onValueChange={(value) => {
                  if (value) setProfile({...profile, workShift: value});
                }}
                className="justify-start flex-wrap"
              >
                <ToggleGroupItem value="midshift" className="px-4">Mid-shift</ToggleGroupItem>
                <ToggleGroupItem value="dayshift" className="px-4">Dayshift</ToggleGroupItem>
                <ToggleGroupItem value="swingshift" className="px-4">Swing-shift</ToggleGroupItem>
                <ToggleGroupItem value="fourthshift" className="px-4">Fourth shift</ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            {/* Only show Flyer Status for support members */}
            {profile.isSupport && (
              <div className="space-y-2">
                <Label>Flyer Status</Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <ToggleGroup 
                      type="single" 
                      variant="outline" 
                      disabled={!isEditing}
                      value={profile.isFlyer ? "yes" : "no"}
                      onValueChange={(value) => {
                        if (value === "yes") setProfile({...profile, isFlyer: true});
                        if (value === "no") setProfile({...profile, isFlyer: false});
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="yes" className="px-4">I am a flyer</ToggleGroupItem>
                      <ToggleGroupItem value="no" className="px-4">I am not a flyer</ToggleGroupItem>
                    </ToggleGroup>
                    
                    {profile.isFlyer && (
                      <ToggleGroup 
                        type="single" 
                        variant="outline" 
                        disabled={!isEditing}
                        value={profile.flyerRole}
                        onValueChange={(value) => {
                          if (value) setProfile({...profile, flyerRole: value});
                        }}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="primary" className="px-4">Primary</ToggleGroupItem>
                        <ToggleGroupItem value="alternate" className="px-4">Alternate</ToggleGroupItem>
                      </ToggleGroup>
                    )}
                  </div>
                ) : (
                  <Input 
                    value={profile.isFlyer ? `Flyer - ${profile.flyerRole === "primary" ? "Primary" : "Alternate"}` : "Not a flyer"} 
                    disabled 
                  />
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button 
                className="bg-flyerPurple-600 hover:bg-flyerPurple-700" 
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              className="bg-flyerPurple-600 hover:bg-flyerPurple-700" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;

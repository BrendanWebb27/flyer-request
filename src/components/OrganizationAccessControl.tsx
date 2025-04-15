
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

interface OrganizationAccessControlProps {
  onAccessGranted: () => void;
}

const OrganizationAccessControl: React.FC<OrganizationAccessControlProps> = ({ 
  onAccessGranted 
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // In a real application, this would come from a database or API
  // This is just for demonstration purposes
  const validCodes: Record<string, string> = {
    "ORG001-FLYER": "IT Department",
    "ORG002-FLYER": "Operations",
    "ORG003-FLYER": "Human Resources"
  };

  const handleVerify = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const organization = validCodes[code];
      
      if (organization) {
        toast({
          title: "Access Granted",
          description: `You now have support access for ${organization}`,
        });
        // Store access in localStorage
        localStorage.setItem("organizationAccess", organization);
        localStorage.setItem("supportAccessGranted", "true");
        onAccessGranted();
      } else {
        setAttempts(prev => prev + 1);
        toast({
          title: "Invalid Code",
          description: "The registration code you entered is invalid.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-flyerPurple-100">
              <Shield className="h-10 w-10 text-flyerPurple-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Organization Verification</CardTitle>
          <CardDescription className="text-center">
            Enter your organization's one-time registration code to access the support dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="code"
                type="text"
                placeholder="Enter registration code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center tracking-widest"
                disabled={isLoading || attempts >= 5}
              />
              {attempts >= 3 && attempts < 5 && (
                <p className="text-amber-500 text-sm text-center">
                  Warning: {5 - attempts} attempts remaining before lockout
                </p>
              )}
              {attempts >= 5 && (
                <p className="text-red-500 text-sm text-center">
                  Too many failed attempts. Please contact your administrator.
                </p>
              )}
            </div>
            <Button 
              onClick={handleVerify} 
              className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
              disabled={!code || isLoading || attempts >= 5}
            >
              {isLoading ? "Verifying..." : "Verify Access"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This code should be provided by your organization administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationAccessControl;

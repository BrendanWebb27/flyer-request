import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail } from "lucide-react";

interface OrganizationAccessControlProps {
  onAccessGranted: () => void;
}

const OrganizationAccessControl: React.FC<OrganizationAccessControlProps> = ({ 
  onAccessGranted 
}) => {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [step, setStep] = useState<"email" | "code">("email");

  // Update allowed domains to only accept @us.af.mil emails
  const allowedDomains = ["us.af.mil"];
  
  // Valid codes per organization domain
  const validCodes: Record<string, string> = {
    "ORG001-FLYER": "Air Force HQ",
    "ORG002-FLYER": "Air Force Operations",
    "ORG003-FLYER": "Air Force Support"
  };

  const checkEmailDomain = () => {
    setIsLoading(true);
    
    // Get domain part of email
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const domain = emailParts[1].toLowerCase();
    
    // Check if domain exactly matches allowed domains
    const isDomainAllowed = allowedDomains.some(allowedDomain => 
      domain === allowedDomain
    );
    
    setTimeout(() => {
      if (isDomainAllowed) {
        setStep("code");
        toast({
          title: "Email Verified",
          description: "Please enter your organization code to continue.",
        });
      } else {
        setAttempts(prev => prev + 1);
        toast({
          title: "Unauthorized Domain",
          description: "Only @us.af.mil email addresses are authorized.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
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
        // Store access in localStorage with additional email info
        localStorage.setItem("organizationAccess", organization);
        localStorage.setItem("supportAccessGranted", "true");
        localStorage.setItem("supportUserEmail", email); // Store verified email
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
            {step === "email" 
              ? "Enter your organization email to verify access"
              : "Enter your organization's one-time registration code"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {step === "email" ? (
              <>
                <div className="space-y-2">
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 opacity-50 mt-3" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.name@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      disabled={isLoading || attempts >= 5}
                    />
                  </div>
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
                  onClick={checkEmailDomain} 
                  className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
                  disabled={!email || isLoading || attempts >= 5}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter registration code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="text-center tracking-widest"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={handleVerify} 
                    className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
                    disabled={!code || isLoading}
                  >
                    {isLoading ? "Verifying..." : "Verify Access"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                  >
                    Change Email
                  </Button>
                </div>
              </>
            )}
            <p className="text-xs text-center text-muted-foreground">
              {step === "email" 
                ? "Only organization domains are allowed access"
                : "This code should be provided by your organization administrator"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationAccessControl;

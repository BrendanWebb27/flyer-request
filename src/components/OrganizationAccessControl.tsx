
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import EmailVerificationStep from "./organization/EmailVerificationStep";
import CodeVerificationStep from "./organization/CodeVerificationStep";
import { 
  isValidDomain, 
  isValidCode, 
  getOrganizationFromCode 
} from "@/utils/organizationVerification";

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

  const checkEmailDomain = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (isValidDomain(email)) {
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
      const organization = getOrganizationFromCode(code);
      
      if (organization) {
        toast({
          title: "Access Granted",
          description: `You now have support access for ${organization}`,
        });
        // Store access in localStorage with additional email info
        localStorage.setItem("organizationAccess", organization);
        localStorage.setItem("supportAccessGranted", "true");
        localStorage.setItem("supportUserEmail", email);
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
          {step === "email" ? (
            <EmailVerificationStep
              email={email}
              setEmail={setEmail}
              onVerify={checkEmailDomain}
              isLoading={isLoading}
              attempts={attempts}
            />
          ) : (
            <CodeVerificationStep
              code={code}
              setCode={setCode}
              onVerify={handleVerify}
              onBack={() => setStep("email")}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationAccessControl;

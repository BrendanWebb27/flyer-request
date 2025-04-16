
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailVerificationStepProps {
  email: string;
  setEmail: (email: string) => void;
  onVerify: () => void;
  isLoading: boolean;
  attempts: number;
}

const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  email,
  setEmail,
  onVerify,
  isLoading,
  attempts,
}) => {
  const [verifiedEmails, setVerifiedEmails] = useState<string[]>([]);
  
  // Load previously verified emails
  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem('verifiedEmails') || '[]');
    setVerifiedEmails(storedEmails);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex">
          <Mail className="mr-2 h-4 w-4 opacity-50 mt-3" />
          <Input
            id="email"
            type="email"
            placeholder="your.name@us.af.mil"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isLoading || attempts >= 5}
          />
        </div>
        
        {/* Show previously verified emails if they exist */}
        {verifiedEmails.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Previously verified emails:</p>
            <div className="flex flex-wrap gap-2">
              {verifiedEmails.map((verifiedEmail, index) => (
                <button
                  key={index}
                  className="px-2 py-1 text-xs border rounded-full hover:bg-flyerPurple-100"
                  onClick={() => setEmail(verifiedEmail)}
                >
                  {verifiedEmail}
                </button>
              ))}
            </div>
          </div>
        )}
        
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
        onClick={onVerify} 
        className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
        disabled={!email || isLoading || attempts >= 5}
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        Only organization domains are allowed access
      </p>
    </div>
  );
};

export default EmailVerificationStep;

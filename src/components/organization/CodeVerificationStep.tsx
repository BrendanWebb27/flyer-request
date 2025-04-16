
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CodeVerificationStepProps {
  code: string;
  setCode: (code: string) => void;
  onVerify: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const CodeVerificationStep: React.FC<CodeVerificationStepProps> = ({
  code,
  setCode,
  onVerify,
  onBack,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
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
          onClick={onVerify} 
          className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
          disabled={!code || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Access"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onBack}
          disabled={isLoading}
        >
          Change Email
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        This code should be provided by your organization administrator
      </p>
    </div>
  );
};

export default CodeVerificationStep;

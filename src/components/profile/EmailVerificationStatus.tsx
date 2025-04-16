
import React from "react";

interface EmailVerificationStatusProps {
  isEmailVerified: boolean;
}

const EmailVerificationStatus: React.FC<EmailVerificationStatusProps> = ({ isEmailVerified }) => {
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Email Verification</h4>
          <p className="text-xs text-muted-foreground">
            {isEmailVerified ? "Your email has been verified" : "Email verification required for system access"}
          </p>
        </div>
        <div className={`px-2 py-1 rounded ${isEmailVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
          <span className="text-xs font-medium">
            {isEmailVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationStatus;

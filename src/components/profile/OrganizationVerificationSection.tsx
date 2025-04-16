
import React from "react";

interface OrganizationVerificationSectionProps {
  isEmailVerified: boolean;
  handleVerifyOrganization: () => void;
}

const OrganizationVerificationSection: React.FC<OrganizationVerificationSectionProps> = ({
  isEmailVerified,
  handleVerifyOrganization
}) => {
  if (isEmailVerified) return null;
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleVerifyOrganization();
  };
  
  return (
    <div className="pt-4">
      <button
        className="text-sm text-flyerPurple-600 hover:text-flyerPurple-700 font-medium"
        onClick={handleButtonClick}
      >
        Verify Organization Access
      </button>
      <p className="text-xs text-muted-foreground mt-1">
        Verify your organization access to gain system privileges
      </p>
    </div>
  );
};

export default OrganizationVerificationSection;

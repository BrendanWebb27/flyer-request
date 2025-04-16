
// Valid organization codes mapped to their organization names
export const validCodes: Record<string, string> = {
  "ORG001-FLYER": "Air Force HQ",
  "ORG002-FLYER": "Air Force Operations",
  "ORG003-FLYER": "Air Force Support"
};

// List of allowed email domains
export const allowedDomains = ["us.af.mil"];

/**
 * Validates if the email domain is allowed
 * @param email Email to validate
 * @returns Boolean indicating if the domain is allowed
 */
export const isValidDomain = (email: string): boolean => {
  const emailParts = email.split('@');
  if (emailParts.length !== 2) return false;
  
  const domain = emailParts[1].toLowerCase();
  return allowedDomains.some(allowedDomain => domain === allowedDomain);
};

/**
 * Validates if the organization code is valid
 * @param code Code to validate
 * @returns Boolean indicating if the code is valid
 */
export const isValidCode = (code: string): boolean => {
  return code in validCodes;
};

/**
 * Gets the organization name from a valid code
 * @param code Valid organization code
 * @returns Organization name or undefined if invalid
 */
export const getOrganizationFromCode = (code: string): string | undefined => {
  return validCodes[code];
};

/**
 * Gets all valid organizations for support reference
 * @returns Array of organization objects with code and name
 */
export const getAllOrganizations = () => {
  return Object.entries(validCodes).map(([code, name]) => ({
    code,
    name
  }));
};

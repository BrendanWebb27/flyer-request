
/**
 * Utility functions for managing user data expiration
 */

// Constants
export const INACTIVITY_PERIOD_DAYS = 30;

/**
 * Updates the last activity timestamp for a user
 */
export const updateUserActivityTimestamp = (): void => {
  localStorage.setItem('lastUserActivity', Date.now().toString());
};

/**
 * Checks if user data has expired based on inactivity period
 * @returns boolean indicating if user data has expired
 */
export const hasUserDataExpired = (): boolean => {
  const lastActivity = localStorage.getItem('lastUserActivity');
  
  if (!lastActivity) {
    // No activity recorded yet, consider as new user
    updateUserActivityTimestamp();
    return false;
  }
  
  const lastActiveTime = parseInt(lastActivity, 10);
  const currentTime = Date.now();
  const inactivityMs = currentTime - lastActiveTime;
  const inactivityDays = inactivityMs / (1000 * 60 * 60 * 24);
  
  return inactivityDays > INACTIVITY_PERIOD_DAYS;
};

/**
 * Clears user data from local storage if the inactivity period has been exceeded
 * @returns boolean indicating if user data was cleared
 */
export const clearExpiredUserData = (): boolean => {
  if (hasUserDataExpired()) {
    localStorage.removeItem('supportAccessGranted');
    localStorage.removeItem('organizationAccess');
    localStorage.removeItem('supportUserEmail');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('lastUserActivity');
    
    // Don't remove verified emails list to maintain device-independent verification
    // localStorage.removeItem('verifiedEmails');
    // localStorage.removeItem('emailOrganizationMap');
    
    console.log('User data cleared due to inactivity');
    return true;
  }
  
  return false;
};

/**
 * Gets the list of verified emails
 * @returns array of verified email addresses
 */
export const getVerifiedEmails = (): string[] => {
  return JSON.parse(localStorage.getItem('verifiedEmails') || '[]');
};

/**
 * Gets the organization associated with a verified email
 * @param email The email address to look up
 * @returns organization name or undefined if not found
 */
export const getEmailOrganization = (email: string): string | undefined => {
  const emailOrganizationMap = JSON.parse(localStorage.getItem('emailOrganizationMap') || '{}');
  return emailOrganizationMap[email];
};

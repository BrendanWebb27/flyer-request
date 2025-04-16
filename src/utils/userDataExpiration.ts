
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
    
    console.log('User data cleared due to inactivity');
    return true;
  }
  
  return false;
};


import { useState, useEffect, useCallback } from 'react';
import { updateUserActivityTimestamp, clearExpiredUserData } from "@/utils/userDataExpiration";
import { getSupportAccess } from "@/utils/supportAccess";

/**
 * Custom hook to handle access control for the support dashboard
 */
export const useDashboardAccess = () => {
  const [hasAccess, setHasAccess] = useState(false);
  
  // Check if user data has expired and if user has already been granted access
  useEffect(() => {
    // Check for data expiration first
    const wasDataCleared = clearExpiredUserData();
    
    if (wasDataCleared) {
      setHasAccess(false);
      return;
    }
    
    // If data wasn't cleared, check for access
    const accessGranted = getSupportAccess();
    if (accessGranted) {
      setHasAccess(true);
      // Update activity timestamp when the user accesses the dashboard
      updateUserActivityTimestamp();
    }
  }, []);

  // Update activity timestamp on user interactions
  const handleUserInteraction = useCallback(() => {
    updateUserActivityTimestamp();
  }, []);
  
  // Grant access handler
  const handleAccessGranted = useCallback(() => {
    setHasAccess(true);
    // Update activity timestamp when access is granted
    updateUserActivityTimestamp();
  }, []);

  return {
    hasAccess,
    handleUserInteraction,
    handleAccessGranted
  };
};

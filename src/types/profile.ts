
/**
 * Types related to user profiles
 */

export interface UserProfile {
  name?: string;
  manNumber: string;
  organization: string;
  workShift: string;
  isFlyer: boolean;
  flyerRole: string;
  isSupport: boolean; // Required for support functionality
  email?: string;
}

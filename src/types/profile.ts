
/**
 * Types related to user profiles
 */

export interface UserProfile {
  name?: string;
  manNumber: string; // Changed from optional to required to match usage in Profile.tsx
  organization: string;
  workShift?: string;
  isFlyer: boolean; // Changed from optional to required to match usage in Profile.tsx
  flyerRole: string; // Changed from optional to required to match usage in Profile.tsx
  isSupport?: boolean;
}

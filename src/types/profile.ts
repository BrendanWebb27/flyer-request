
/**
 * Types related to user profiles
 */

export interface UserProfile {
  name?: string;
  manNumber: string; // Required to match usage in Profile.tsx
  organization: string;
  workShift: string; // Changed from optional to required to match usage in Profile.tsx
  isFlyer: boolean; // Required to match usage in Profile.tsx
  flyerRole: string; // Required to match usage in Profile.tsx
  isSupport?: boolean;
}

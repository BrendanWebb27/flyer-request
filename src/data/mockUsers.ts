
import { UserSuggestion } from "@/types/userSearch";

// Mock user database for autocomplete
// In a real application, this would be fetched from an API
export const mockUsers: (UserSuggestion & { manNumber: string, organization: string })[] = [
  { username: "12345 John Smith", email: "john.smith@us.af.mil", manNumber: "AF12345", organization: "36 FGS" },
  { username: "23456 Jane Doe", email: "jane.doe@us.af.mil", manNumber: "AF23456", organization: "36 FGS" },
  { username: "34567 Robert Johnson", email: "robert.johnson@us.af.mil", manNumber: "AF34567", organization: "36th Fighter Generation Squadron" },
  { username: "45678 Lisa Brown", email: "lisa.brown@us.af.mil", manNumber: "AF45678", organization: "36 FGS" },
  { username: "56789 Michael Wilson", email: "michael.wilson@us.af.mil", manNumber: "AF56789", organization: "36 FGS" },
  { username: "67890 Sarah Davis", email: "sarah.davis@us.af.mil", manNumber: "AF67890", organization: "36th Fighter Generation Squadron" },
  { username: "78901 David Miller", email: "david.miller@us.af.mil", manNumber: "AF78901", organization: "36 FGS" },
  { username: "89012 Jennifer Taylor", email: "jennifer.taylor@us.af.mil", manNumber: "AF89012", organization: "36 FGS" },
  { username: "04074 SSgt Webb", email: "brendan.webb@us.af.mil", manNumber: "AF04074", organization: "36 FGS" },
];

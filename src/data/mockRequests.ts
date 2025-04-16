
import { Request } from "@/types/request";

// Mock data for development and testing
export const mockRequests: Request[] = [
  {
    id: "REQ-001",
    location: "A2L",
    details: "Need assistance with equipment calibration.",
    createdAt: "2023-04-15T09:30:00Z",
    status: "active",
    assignedTo: "John Smith",
    estimatedArrival: "10 minutes",
    requestedBy: "user123",
    notes: [],
    assetType: "equipment"
  },
  {
    id: "REQ-002",
    location: "B17R",
    details: "Require support for safety inspection.",
    createdAt: "2023-04-15T10:15:00Z",
    status: "active",
    assignedTo: "Jane Doe",
    estimatedArrival: "15 minutes",
    requestedBy: "user456",
    notes: [],
    assetType: "safety"
  },
  {
    id: "REQ-003",
    location: "C23L",
    details: "Material assistance needed for assembly.",
    createdAt: "2023-04-15T11:00:00Z",
    status: "pending",
    requestedBy: "user789",
    notes: [],
    assetType: "material"
  },
  {
    id: "REQ-004",
    location: "D5R",
    details: "Quality check required for production line.",
    createdAt: "2023-04-15T11:30:00Z",
    status: "pending",
    requestedBy: "user123",
    notes: [],
    assetType: "quality"
  },
  {
    id: "REQ-005",
    location: "E12L",
    details: "Tool turnover needed between shifts.",
    createdAt: "2023-04-15T12:00:00Z",
    status: "pending",
    requestedBy: "user456",
    notes: [],
    assetType: "tool-turnover",
    secondUser: "user789"
  },
  {
    id: "REQ-006",
    location: "F8R",
    details: "Completed safety inspection and documentation.",
    createdAt: "2023-04-14T14:30:00Z",
    status: "completed",
    assignedTo: "John Smith",
    requestedBy: "user789",
    completedAt: "2023-04-14T15:45:00Z",
    notes: [
      {
        text: "Completed safety inspection. All systems operational.",
        timestamp: "2023-04-14T15:45:00Z",
        author: "John Smith"
      }
    ],
    assetType: "safety"
  }
];

// Export the mock requests as initialRequests for persistence
export const initialRequests = mockRequests;

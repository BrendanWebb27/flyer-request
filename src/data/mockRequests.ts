
import { Request, RequestStatus } from "@/types/request";

export const initialRequests: Request[] = [
  {
    id: "REQ-1234",
    location: "Building A, Room 105",
    details: "Need assistance with carrying boxes to the mail room",
    createdAt: "2025-04-15T09:30:00Z",
    status: "active",
    assignedTo: "John Doe",
    estimatedArrival: "10 minutes",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1235",
    location: "Building B, Conference Room 3",
    details: "Help required with setting up projector for presentation",
    createdAt: "2025-04-15T10:15:00Z",
    status: "active",
    assignedTo: "Sarah Johnson",
    estimatedArrival: "5 minutes",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1236",
    location: "Building C, Cafeteria",
    details: "Need assistance with food delivery for event",
    createdAt: "2025-04-15T08:45:00Z",
    status: "pending",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1237",
    location: "Building A, Room 302",
    details: "Assist with moving furniture for event setup",
    createdAt: "2025-04-15T11:20:00Z",
    status: "pending",
    requestedBy: "user456",
    notes: []
  },
  {
    id: "REQ-1238",
    location: "Building D, Lobby",
    details: "Delivery of package from mailroom",
    createdAt: "2025-04-15T09:15:00Z",
    status: "pending",
    requestedBy: "user123",
    notes: []
  },
  {
    id: "REQ-1239",
    location: "Building A, Room 201",
    details: "Technical assistance with projector",
    createdAt: "2025-04-15T13:45:00Z",
    status: "completed",
    assignedTo: "Mike Wilson",
    requestedBy: "user123",
    notes: [{
      text: "Fixed HDMI connection issue",
      timestamp: "2025-04-15T14:15:00Z",
      author: "Mike Wilson"
    }]
  }
];

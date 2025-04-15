
export type RequestFormData = {
  location: string;
  details: string;
  assetType: string;
};

export interface Note {
  text: string;
  timestamp: string;
  author: string;
}

export type RequestStatus = "pending" | "active" | "completed" | "cancelled";

export interface Request {
  id: string;
  location: string;
  details: string;
  createdAt: string;
  status: RequestStatus;
  estimatedDuration: string;
  assignedTo?: string;
  estimatedArrival?: string;
  requestedBy: string;
  completedAt?: string;
  notes: Note[];
}

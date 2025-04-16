
export type RequestFormData = {
  location: string;
  details: string;
  assetType: string;
  secondUser?: string;
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
  assignedTo?: string;
  estimatedArrival?: string;
  requestedBy: string;
  completedAt?: string;
  notes: Note[];
  assetType: string;
  secondUser?: string;
}

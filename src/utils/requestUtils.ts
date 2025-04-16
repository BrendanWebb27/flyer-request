
import { Request, RequestStatus } from "@/types/request";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const countRequestsByStatus = (requests: Request[], status: RequestStatus | "all") => {
  if (status === "all") return requests.length;
  return requests.filter(r => r.status === status).length;
};

export const countCompletedToday = (requests: Request[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  
  return requests.filter(request => {
    if (request.status !== "completed" || !request.completedAt) return false;
    const completedDate = new Date(request.completedAt);
    return completedDate >= today;
  }).length;
};



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

export const countRequestsByStatus = (requests: Request[], status: RequestStatus) => {
  return requests.filter(r => r.status === status).length;
};

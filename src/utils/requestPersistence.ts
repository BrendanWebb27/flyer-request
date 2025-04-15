
import { Request } from "@/types/request";
import { initialRequests } from "@/data/mockRequests";

// Load requests from localStorage
export const loadRequests = (): Request[] => {
  const savedRequests = localStorage.getItem('requestsUpdate');
  return savedRequests ? JSON.parse(savedRequests) : initialRequests;
};

// Save requests to localStorage and trigger update events
export const saveRequests = (requests: Request[]): void => {
  localStorage.setItem('requestsUpdate', JSON.stringify(requests));
  localStorage.setItem('lastRequestUpdate', new Date().toISOString());
  
  // Dispatch events to notify other components
  window.dispatchEvent(new CustomEvent('requestUpdated'));
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'requestsUpdate',
    newValue: JSON.stringify(requests)
  }));
};

// Track which requests have had notifications sent
export const getNotifiedRequests = (): string[] => {
  return JSON.parse(localStorage.getItem('notifiedRequests') || '[]');
};

export const addNotifiedRequest = (requestId: string): void => {
  const notifiedRequests = getNotifiedRequests();
  if (!notifiedRequests.includes(requestId)) {
    notifiedRequests.push(requestId);
    localStorage.setItem('notifiedRequests', JSON.stringify(notifiedRequests));
  }
};

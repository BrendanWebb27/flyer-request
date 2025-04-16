
import { Request } from "@/types/request";
import { initialRequests } from "@/data/mockRequests";

// Load requests from localStorage with synchronization capability
export const loadRequests = (): Request[] => {
  // Check for latest updates first
  const lastUpdate = localStorage.getItem('lastRequestUpdate');
  const savedRequests = localStorage.getItem('requestsUpdate');
  
  // Log loading activity for debugging
  console.log(`Loading requests at ${new Date().toISOString()}. Last update: ${lastUpdate || 'none'}`);
  
  // Return saved requests or initialize with defaults
  return savedRequests ? JSON.parse(savedRequests) : initialRequests;
};

// Save requests to localStorage with improved synchronization events
export const saveRequests = (requests: Request[]): void => {
  // Generate timestamp for this update
  const updateTime = new Date().toISOString();
  
  // Store the requests and update timestamp
  localStorage.setItem('requestsUpdate', JSON.stringify(requests));
  localStorage.setItem('lastRequestUpdate', updateTime);
  
  // Log the save operation for debugging
  console.log(`Saving ${requests.length} requests at ${updateTime}`, requests);
  
  // Dispatch multiple events to ensure all components are notified
  // 1. Custom event for internal components
  window.dispatchEvent(new CustomEvent('requestUpdated', {
    detail: { timestamp: updateTime, count: requests.length }
  }));
  
  // 2. Storage event for cross-tab communication
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'requestsUpdate',
    newValue: JSON.stringify(requests),
    url: window.location.href,
    storageArea: localStorage
  }));
  
  // 3. General metrics update event
  window.dispatchEvent(new CustomEvent('metricsUpdate', { 
    detail: { timestamp: updateTime }
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

// Forcefully refresh all request data from storage
export const forceRequestSync = (): void => {
  const updateTime = new Date().toISOString();
  console.log(`Force syncing requests at ${updateTime}`);
  
  // Trigger multiple events to ensure all components refresh
  window.dispatchEvent(new CustomEvent('requestUpdated', {
    detail: { timestamp: updateTime, forceSync: true }
  }));
  window.dispatchEvent(new CustomEvent('requestsForceSync', {
    detail: { timestamp: updateTime }
  }));
};

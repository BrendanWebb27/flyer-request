
import { RequestFormData, Request } from "@/types/request";
import { loadRequests, saveRequests } from "./requestPersistence";

// Function to ensure all tabs are notified of request submission
export const notifyAllTabsAboutNewRequest = () => {
  // Use a custom event to notify all tabs
  window.dispatchEvent(new CustomEvent('requestsForceSync', {
    detail: {
      timestamp: new Date().toISOString(),
      action: 'newRequest'
    }
  }));
  
  // Use localStorage to notify other tabs
  const notificationKey = `request_notification_${Date.now()}`;
  localStorage.setItem(notificationKey, Date.now().toString());
  
  // Clean up old notifications (to avoid localStorage bloat)
  setTimeout(() => {
    localStorage.removeItem(notificationKey);
  }, 5000);
  
  // Force an additional sync by modifying a sync trigger in localStorage
  localStorage.setItem('requestSyncTrigger', Date.now().toString());
  
  // Force request refresh
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'requestsUpdate',
    newValue: localStorage.getItem('requestsUpdate'),
    url: window.location.href,
    storageArea: localStorage
  }));
};

// Modify the existing submitFlyerRequest function to include notification
export const submitFlyerRequest = async (data: RequestFormData): Promise<void> => {
  console.log("Submitting request:", data);
  
  // Generate a unique ID for the request
  const requestId = `REQ${Date.now().toString().slice(-6)}`;
  
  // Create the request object
  const newRequest: Request = {
    id: requestId,
    location: data.location,
    details: data.details,
    createdAt: new Date().toISOString(),
    status: "pending",
    requestedBy: localStorage.getItem("supportUserEmail") || "user@example.com",
    notes: [],
    assetType: data.assetType || "standard",
    secondUser: data.secondUser
  };
  
  // Load existing requests
  const currentRequests = loadRequests();
  
  // Add the new request to the beginning of the array
  const updatedRequests = [newRequest, ...currentRequests];
  
  // Save the updated requests
  saveRequests(updatedRequests);
  
  // Notify all tabs/users about the new request
  notifyAllTabsAboutNewRequest();
  
  console.log("Request submitted successfully:", newRequest);

  // Force a delay before resolving to ensure storage events are processed
  return new Promise(resolve => setTimeout(resolve, 1000));
};

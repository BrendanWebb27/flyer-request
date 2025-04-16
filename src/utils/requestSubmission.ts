
import { RequestFormData, Request } from "@/types/request";
import { loadRequests, saveRequests } from "./requestPersistence";

// Function to ensure all tabs are notified of request submission
export const notifyAllTabsAboutNewRequest = (newRequest: Request) => {
  // Use a custom event to notify all tabs
  window.dispatchEvent(new CustomEvent('requestsForceSync', {
    detail: {
      timestamp: new Date().toISOString(),
      action: 'newRequest',
      request: newRequest
    }
  }));
  
  // Dispatch a specific event for support users to see
  window.dispatchEvent(new CustomEvent('supportNewRequest', {
    detail: {
      request: newRequest,
      timestamp: new Date().toISOString()
    }
  }));
  
  // Use localStorage to notify other tabs
  const notificationKey = `request_notification_${Date.now()}`;
  localStorage.setItem(notificationKey, JSON.stringify({
    type: 'new_request',
    requestId: newRequest.id,
    timestamp: Date.now()
  }));
  
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
  
  // Get the current user's email from localStorage
  const userEmail = localStorage.getItem("supportUserEmail") || "user@example.com";
  console.log("Current user submitting request:", userEmail);
  
  // Generate a unique ID for the request
  const requestId = `REQ${Date.now().toString().slice(-6)}`;
  
  // Create the request object
  const newRequest: Request = {
    id: requestId,
    location: data.location,
    details: data.details,
    createdAt: new Date().toISOString(),
    status: "pending",
    requestedBy: userEmail, // Use email as identifier for proper matching
    notes: [],
    assetType: data.assetType || "standard",
    secondUser: data.secondUser
  };
  
  console.log("Created new request with owner:", newRequest.requestedBy);
  
  // Load existing requests
  const currentRequests = loadRequests();
  
  // Add the new request to the beginning of the array
  const updatedRequests = [newRequest, ...currentRequests];
  
  // Save the updated requests
  saveRequests(updatedRequests);
  
  // Notify all tabs/users about the new request
  notifyAllTabsAboutNewRequest(newRequest);
  
  console.log("Request submitted successfully:", newRequest);

  // Force a delay before resolving to ensure storage events are processed
  return new Promise(resolve => setTimeout(resolve, 1000));
};

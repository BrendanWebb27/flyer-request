
import { Request, RequestStatus, Note } from "@/types/request";
import { saveRequests } from "./requestPersistence";

export const acceptRequest = (
  requests: Request[], 
  id: string, 
  data: { assignedTo: string; estimatedTime: string }
): Request[] => {
  console.log("acceptRequest called with:", { id, data });
  console.log("Current requests before update:", requests);
  
  // Find the request to update
  const requestToUpdate = requests.find(req => req.id === id);
  
  if (!requestToUpdate) {
    console.error("Could not find request with ID:", id);
    return requests;
  }
  
  console.log("Found request to update:", requestToUpdate);
  
  // Create a new array with the updated request
  const updatedRequests = requests.map(request => 
    request.id === id 
      ? { 
          ...request, 
          status: "active" as RequestStatus,
          assignedTo: data.assignedTo,
          estimatedArrival: data.estimatedTime 
        }
      : request
  );
  
  console.log("Updated requests after accept:", updatedRequests);
  console.log("Specific request after update:", 
    updatedRequests.find(req => req.id === id)
  );
  
  // Save to localStorage to ensure persistence
  saveRequests(updatedRequests);
  
  // Dispatch an event to notify other components about the status change
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('requestStatusChanged', {
      detail: { id, newStatus: 'active', data }
    }));
  }, 100);
  
  return updatedRequests;
};

export const completeRequest = (
  requests: Request[], 
  id: string, 
  note?: { text: string, author: string }
): Request[] => {
  const updatedRequests = requests.map(request => {
    if (request.id === id) {
      const updatedRequest: Request = { 
        ...request, 
        status: "completed" as RequestStatus,
        completedAt: new Date().toISOString()
      };
      
      if (note) {
        updatedRequest.notes = [
          ...(request.notes || []), 
          {
            ...note,
            timestamp: new Date().toISOString()
          }
        ];
      }
      
      return updatedRequest;
    }
    return request;
  });
  
  saveRequests(updatedRequests);
  
  // Dispatch an event for the status change
  window.dispatchEvent(new CustomEvent('requestStatusChanged', {
    detail: { id, newStatus: 'completed' }
  }));
  
  return updatedRequests;
};

export const addNoteToRequest = (
  requests: Request[], 
  id: string, 
  note: { text: string, author: string }
): Request[] => {
  const updatedRequests = requests.map(request => {
    if (request.id === id) {
      return {
        ...request,
        notes: [
          ...(request.notes || []),
          {
            ...note,
            timestamp: new Date().toISOString()
          } as Note
        ]
      };
    }
    return request;
  });
  
  saveRequests(updatedRequests);
  
  return updatedRequests;
};


import { Request, RequestStatus, Note } from "@/types/request";
import { saveRequests } from "./requestPersistence";

// Update a request's status to active
export const acceptRequest = (
  requests: Request[], 
  id: string, 
  data: { assignedTo: string; estimatedTime: string }
): Request[] => {
  console.log("Before update - Request status for", id, ":", requests.find(req => req.id === id)?.status);
  
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
  
  console.log("After update - Updated requests:", updatedRequests);
  console.log("After update - Request status for", id, ":", updatedRequests.find(req => req.id === id)?.status);
  
  // Save updated requests
  saveRequests(updatedRequests);
  
  return updatedRequests;
};

// Mark a request as complete
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
  
  // Save updated requests
  saveRequests(updatedRequests);
  
  return updatedRequests;
};

// Add a note to a request
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
  
  // Save updated requests
  saveRequests(updatedRequests);
  
  return updatedRequests;
};

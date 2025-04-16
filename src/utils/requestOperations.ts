import { Request, RequestStatus, Note } from "@/types/request";
import { saveRequests } from "./requestPersistence";

export const acceptRequest = (
  requests: Request[], 
  id: string, 
  data: { assignedTo: string; estimatedTime: string }
): Request[] => {
  console.log("acceptRequest called with:", { id, data });
  console.log("Current requests before update:", requests);
  
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
  
  saveRequests(updatedRequests);
  
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

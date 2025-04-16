
import React from "react";
import RequestDetailsItem from "./RequestDetailsItem";
import RequestDetailsNotes from "./RequestDetailsNotes";
import { Request } from "@/types/request";
import { useProfileAccess } from "@/hooks/useProfileAccess";

interface RequestDetailsSectionProps {
  request: Request;
}

const RequestDetailsSection: React.FC<RequestDetailsSectionProps> = ({ request }) => {
  const { findProfileByUsername } = useProfileAccess();
  
  // Get username from email
  const getDisplayName = (email: string) => {
    const profile = findProfileByUsername(email);
    if (profile && profile.name) {
      return profile.name;
    }
    // Fallback to just the username part of the email if no profile found
    return email.split('@')[0];
  };
  
  return (
    <div className="space-y-4">
      <RequestDetailsItem 
        label="Location"
        value={request.location}
      />
      <RequestDetailsItem 
        label="Asset Type"
        value={request.assetType}
      />
      {request.secondUser && (
        <RequestDetailsItem 
          label="Receiving User"
          value={request.secondUser}
        />
      )}
      <RequestDetailsItem 
        label="Details"
        value={request.details}
        multiline
      />
      <RequestDetailsItem 
        label="Requested By"
        value={getDisplayName(request.requestedBy)}
      />
      {request.assignedTo && (
        <RequestDetailsItem 
          label="Assigned To"
          value={request.assignedTo}
        />
      )}
      {request.estimatedArrival && (
        <RequestDetailsItem 
          label="Estimated Arrival"
          value={request.estimatedArrival}
        />
      )}
      
      {/* Notes section */}
      {request.notes && request.notes.length > 0 && (
        <RequestDetailsNotes notes={request.notes} />
      )}
    </div>
  );
};

export default RequestDetailsSection;

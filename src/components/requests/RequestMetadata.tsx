
import React from "react";
import { MapPin, Clock, User, Calendar } from "lucide-react";

interface RequestMetadataProps {
  location: string;
  details: string;
  createdAt: string;
  formatDate: (dateString: string) => string;
  assignedTo?: string;
  estimatedArrival?: string;
  requestedBy?: string;
  completedAt?: string;
}

export const RequestMetadata: React.FC<RequestMetadataProps> = ({
  location,
  details,
  createdAt,
  formatDate,
  assignedTo,
  estimatedArrival,
  requestedBy,
  completedAt
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <MapPin size={18} className="text-flyerPurple-500" />
        {location}
      </h3>
      
      <p className="text-muted-foreground">{details}</p>
      
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>Created: {formatDate(createdAt)}</span>
        </div>
        
        {requestedBy && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Requested by: {requestedBy}</span>
          </div>
        )}
        
        {assignedTo && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>Assigned to: {assignedTo}</span>
          </div>
        )}

        {estimatedArrival && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Arrives in: {estimatedArrival}</span>
          </div>
        )}
        
        {completedAt && (
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>Completed: {formatDate(completedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestMetadata;

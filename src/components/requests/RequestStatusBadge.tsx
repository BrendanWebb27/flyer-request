
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/types/request";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500 animate-pulse-light";
    case "pending":
      return "bg-yellow-500";
    case "completed":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
};

const getStatusText = (status: RequestStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

export const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex h-3 w-3 rounded-full ${getStatusColor(status)}`} />
      <Badge variant="outline" className="font-medium">
        {getStatusText(status)}
      </Badge>
    </div>
  );
};

export default RequestStatusBadge;

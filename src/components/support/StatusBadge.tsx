
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/types/request";

interface StatusBadgeProps {
  status: RequestStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Active</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
    case "completed":
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
  }
};

export default StatusBadge;

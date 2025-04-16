
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { BellOff } from "lucide-react";

interface RequestEmptyRowProps {
  activeTab: string;
}

const RequestEmptyRow: React.FC<RequestEmptyRowProps> = ({ activeTab }) => {
  const getMessage = () => {
    if (activeTab === "pending") {
      return "No pending requests waiting for action";
    } else if (activeTab === "active") {
      return "No active requests in progress";
    } else if (activeTab === "completed") {
      return "No completed requests to display";
    } else {
      return "No requests found";
    }
  };

  return (
    <TableRow>
      <TableCell colSpan={6} className="h-32">
        <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
          <BellOff className="h-8 w-8" />
          <p>{getMessage()}</p>
          {activeTab === "pending" && (
            <p className="text-sm">New requests will appear here when submitted</p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RequestEmptyRow;

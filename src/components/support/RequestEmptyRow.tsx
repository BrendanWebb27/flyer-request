
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface RequestEmptyRowProps {
  activeTab: string;
}

const RequestEmptyRow: React.FC<RequestEmptyRowProps> = ({ activeTab }) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
        No {activeTab === "all" ? "" : activeTab} requests found
      </TableCell>
    </TableRow>
  );
};

export default RequestEmptyRow;

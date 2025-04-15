
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyTableRowProps {
  activeTab: string;
  colSpan: number;
}

const EmptyTableRow: React.FC<EmptyTableRowProps> = ({ activeTab, colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-6 text-muted-foreground">
        No {activeTab === "all" ? "" : activeTab} requests found
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;


import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RequestTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Created</TableHead>
        <TableHead>Estimated Arrival</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RequestTableHeader;

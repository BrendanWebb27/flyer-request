
import React from "react";
import { Card } from "@/components/ui/card";

interface EmptyRequestsStateProps {
  status: string;
}

const EmptyRequestsState: React.FC<EmptyRequestsStateProps> = ({ status }) => {
  return (
    <Card className="col-span-full p-6 text-center">
      <p className="text-muted-foreground">No {status !== "all" ? status : ""} requests found.</p>
    </Card>
  );
};

export default EmptyRequestsState;

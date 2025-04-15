
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Calendar } from "lucide-react";

interface DashboardMetricsProps {
  pendingCount: number;
  activeCount: number;
  completedCount: number;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  pendingCount,
  activeCount,
  completedCount
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
              <p className="text-3xl font-bold">{pendingCount}</p>
            </div>
            <div className="p-2 rounded-full bg-yellow-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
              <p className="text-3xl font-bold">{activeCount}</p>
            </div>
            <div className="p-2 rounded-full bg-green-500">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <p className="text-3xl font-bold">{completedCount}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;

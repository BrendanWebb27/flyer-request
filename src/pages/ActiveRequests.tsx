
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { RequestStatus } from "@/types/request";
import RequestsTabContent from "@/components/requests/RequestsTabContent";

const ActiveRequests: React.FC = () => {
  const { toast } = useToast();
  const { requests, formatDate, clearRequest, undoClearRequest, acceptRequest } = useSupportRequests();
  const [recentlyCleared, setRecentlyCleared] = useState<{id: string, index: number} | null>(null);
  
  // This would come from authentication in a real app
  const currentUserId = "user123";
  
  const handleClearRequest = (id: string) => {
    const requestIndex = requests.findIndex(req => req.id === id);
    clearRequest(id);
    
    setRecentlyCleared({ id, index: requestIndex });
    
    toast({
      title: "Request Cleared",
      description: "Request has been cleared from your view",
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (recentlyCleared) {
              undoClearRequest(recentlyCleared.id, recentlyCleared.index);
              setRecentlyCleared(null);
              toast({
                title: "Request Restored",
                description: "Request has been restored to your view"
              });
            }
          }}
        >
          Undo
        </Button>
      )
    });
    
    // Clear the recently cleared item after a timeout
    setTimeout(() => {
      setRecentlyCleared(null);
    }, 10000); // 10 seconds
  };

  // Handle accepting a request with estimated time
  const handleAcceptRequest = (id: string, data: { estimatedTime: string }) => {
    acceptRequest(id, { 
      assignedTo: "Current Support Staff", // In a real app, you'd get the current user's name
      estimatedTime: data.estimatedTime 
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "pending", "active", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <RequestsTabContent
              requests={requests}
              status={tab as RequestStatus | "all"}
              formatDate={formatDate}
              onClearRequest={handleClearRequest}
              currentUserId={currentUserId}
              onAcceptRequest={handleAcceptRequest}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ActiveRequests;

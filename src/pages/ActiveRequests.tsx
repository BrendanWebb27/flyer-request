
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { RequestStatus } from "@/types/request";
import RequestsTabContent from "@/components/requests/RequestsTabContent";
import { useLocation, useNavigate } from "react-router-dom";

const ActiveRequests: React.FC = () => {
  const { toast } = useToast();
  const { requests, formatDate, clearRequest, undoClearRequest, acceptRequest } = useSupportRequests();
  const [recentlyCleared, setRecentlyCleared] = useState<{id: string, index: number} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract status from URL query params
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | null;
  const [activeTab, setActiveTab] = useState<string>(statusParam || "all");

  // Update URL when tab changes
  useEffect(() => {
    if (statusParam !== activeTab && activeTab !== "all") {
      navigate(`/active?status=${activeTab}`, { replace: true });
    } else if (statusParam !== activeTab && activeTab === "all") {
      navigate("/active", { replace: true });
    }
  }, [activeTab, navigate, statusParam]);

  // Update active tab when URL changes
  useEffect(() => {
    if (statusParam && ["pending", "active", "completed"].includes(statusParam)) {
      setActiveTab(statusParam);
    } else if (statusParam === null) {
      setActiveTab("all");
    }
  }, [statusParam]);
  
  // This would come from authentication in a real app
  const currentUserId = "user123";
  
  // Check for support access
  const isSupport = localStorage.getItem("supportAccessGranted") === "true";
  
  // Handle clearing a request
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
    
    toast({
      title: "Request Accepted",
      description: `You will arrive in approximately ${data.estimatedTime}`
    });
  };

  // Only display tabs that the user has access to
  const availableTabs = isSupport 
    ? ["all", "pending", "active", "completed"] 
    : ["all", "active", "completed"];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {availableTabs.map(tab => (
            <TabsTrigger key={tab} value={tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <RequestsTabContent
              requests={requests}
              status={tab as RequestStatus | "all"}
              formatDate={formatDate}
              onClearRequest={handleClearRequest}
              currentUserId={currentUserId}
              onAcceptRequest={isSupport ? handleAcceptRequest : undefined}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ActiveRequests;

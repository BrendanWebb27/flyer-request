
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TabsContent } from "@/components/ui/tabs";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { useLocation, useNavigate } from "react-router-dom";
import { RequestStatus } from "@/types/request";

// Component imports
import OrganizationAccessControl from "@/components/OrganizationAccessControl";
import DashboardHeader from "@/components/support/DashboardHeader";
import DashboardMetrics from "@/components/support/DashboardMetrics";
import RequestTabs from "@/components/support/RequestTabs";
import RequestsTable from "@/components/support/RequestsTable";

const SupportDashboard: React.FC = () => {
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const { 
    requests, 
    acceptRequest, 
    completeRequest, 
    formatDate, 
    addNote,
    metrics,
    clearRequest,
    undoClearRequest
  } = useSupportRequests();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract status from URL query params
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | "all" | null;
  const activeTab = statusParam || "all";
  
  // Check if user has already been granted access
  useEffect(() => {
    const accessGranted = localStorage.getItem("supportAccessGranted") === "true";
    if (accessGranted) {
      setHasAccess(true);
    }
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("supportAccessGranted");
    localStorage.removeItem("organizationAccess");
    setHasAccess(false);
    toast({
      title: "Signed Out",
      description: "You have been signed out of the support dashboard",
    });
  };

  // Log metrics for debugging
  useEffect(() => {
    console.log("Dashboard metrics:", metrics);
  }, [metrics]);

  // If user doesn't have access, show the access control component
  if (!hasAccess) {
    return <OrganizationAccessControl onAccessGranted={() => setHasAccess(true)} />;
  }

  // Organization information (in a real app, this would come from context or state)
  const organization = localStorage.getItem("organizationAccess") || "Organization";

  return (
    <div className="space-y-6">
      <DashboardHeader 
        organization={organization} 
        onSignOut={handleSignOut} 
      />
      
      <DashboardMetrics 
        pendingCount={metrics.pending}
        activeCount={metrics.active}
        completedCount={metrics.completedToday}
      />
      
      <h2 className="text-2xl font-bold">Support Requests</h2>

      <RequestTabs defaultValue={activeTab}>
        {["all", "pending", "active", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <RequestsTable
              requests={requests}
              activeTab={tab}
              formatDate={formatDate}
              acceptRequest={acceptRequest}
              completeRequest={completeRequest}
              addNote={addNote}
              clearRequest={clearRequest}
              undoClearRequest={undoClearRequest}
            />
          </TabsContent>
        ))}
      </RequestTabs>
    </div>
  );
};

export default SupportDashboard;

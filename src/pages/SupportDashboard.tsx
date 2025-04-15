
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSupportRequests } from "@/hooks/useSupportRequests";

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
    countByStatus,
    addNote
  } = useSupportRequests();
  
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
        pendingCount={countByStatus("pending")}
        activeCount={countByStatus("active")}
        completedCount={countByStatus("completed")}
      />

      <RequestTabs defaultValue="pending">
        {["all", "pending", "active", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <RequestsTable
              requests={requests}
              activeTab={tab}
              formatDate={formatDate}
              acceptRequest={acceptRequest}
              completeRequest={completeRequest}
              addNote={addNote}
            />
          </TabsContent>
        ))}
      </RequestTabs>
    </div>
  );
};

export default SupportDashboard;

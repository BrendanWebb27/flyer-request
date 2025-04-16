
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TabsContent } from "@/components/ui/tabs";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { useLocation, useNavigate } from "react-router-dom";
import { RequestStatus } from "@/types/request";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateUserActivityTimestamp, clearExpiredUserData } from "@/utils/userDataExpiration";

// Component imports
import OrganizationAccessControl from "@/components/OrganizationAccessControl";
import DashboardHeader from "@/components/support/DashboardHeader";
import DashboardMetrics from "@/components/support/DashboardMetrics";
import RequestTabs from "@/components/support/RequestTabs";
import RequestsTable from "@/components/support/RequestsTable";
import UserLookup from "@/components/support/UserLookup";

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
  
  // Mode switching between requests and user lookup
  const [activeMode, setActiveMode] = useState<"requests" | "users">("requests");
  
  // Extract status from URL query params
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | "all" | null;
  const activeTab = statusParam || "all";
  
  // Check if user data has expired and if user has already been granted access
  useEffect(() => {
    // Check for data expiration first
    const wasDataCleared = clearExpiredUserData();
    
    if (wasDataCleared) {
      setHasAccess(false);
      return;
    }
    
    // If data wasn't cleared, check for access
    const accessGranted = localStorage.getItem("supportAccessGranted") === "true";
    if (accessGranted) {
      setHasAccess(true);
      // Update activity timestamp when the user accesses the dashboard
      updateUserActivityTimestamp();
    }
  }, []);

  // Log metrics for debugging
  useEffect(() => {
    console.log("Dashboard metrics:", metrics);
  }, [metrics]);

  // If user doesn't have access, show the access control component
  if (!hasAccess) {
    return <OrganizationAccessControl onAccessGranted={() => {
      setHasAccess(true);
      // Update activity timestamp when access is granted
      updateUserActivityTimestamp();
    }} />;
  }

  // Organization information (in a real app, this would come from context or state)
  const organization = localStorage.getItem("organizationAccess") || "Organization";
  const userEmail = localStorage.getItem("supportUserEmail") || "";

  // Update activity timestamp on user interactions
  const handleUserInteraction = () => {
    updateUserActivityTimestamp();
  };

  return (
    <div className="space-y-6" onClick={handleUserInteraction}>
      <DashboardHeader 
        organization={organization}
        userEmail={userEmail}
      />
      
      <DashboardMetrics 
        pendingCount={metrics.pending}
        activeCount={metrics.active}
        completedCount={metrics.completedToday}
      />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Dashboard</h2>
        
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "requests" | "users")}>
          <TabsList>
            <TabsTrigger value="requests">Support Requests</TabsTrigger>
            <TabsTrigger value="users">User Verification</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeMode === "users" ? (
        <UserLookup />
      ) : (
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
      )}
    </div>
  );
};

export default SupportDashboard;

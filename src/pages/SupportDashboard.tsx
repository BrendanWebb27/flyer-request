
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { RequestStatus } from "@/types/request";

// New custom hooks
import { useDashboardAccess } from "@/hooks/useDashboardAccess";
import { useDashboardSync } from "@/hooks/useDashboardSync";
import { useDashboardNotifications } from "@/hooks/useDashboardNotifications";

// Component imports
import OrganizationAccessControl from "@/components/OrganizationAccessControl";
import DashboardHeader from "@/components/support/DashboardHeader";
import DashboardMetrics from "@/components/support/DashboardMetrics";
import DashboardControls from "@/components/support/DashboardControls";
import DashboardContent from "@/components/support/DashboardContent";

const SupportDashboard: React.FC = () => {
  // Access control hook
  const { hasAccess, handleUserInteraction, handleAccessGranted } = useDashboardAccess();
  
  // Request sync hook
  const { syncTimer, forceSyncRequests } = useDashboardSync();
  
  // Mode switching between requests and user lookup
  const [activeMode, setActiveMode] = useState<"requests" | "users">("requests");
  
  // Tab state management
  const [activeTab, setActiveTab] = useState<string>("all");
  const location = useLocation();
  
  // Extract status from URL query params
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | "all" | null;
  
  // Update activeTab state when URL changes
  useEffect(() => {
    if (statusParam) {
      setActiveTab(statusParam);
    } else {
      setActiveTab("all");
    }
  }, [statusParam]);
  
  // Get support requests data
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
  
  // Notifications hook
  const { newRequestCount, resetNotificationCount } = useDashboardNotifications(
    activeTab, 
    forceSyncRequests
  );
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // Reset notification counter when viewing pending requests
    if (value === "pending") {
      resetNotificationCount();
    }
    
    // Force sync when changing tabs
    forceSyncRequests();
  };

  // If user doesn't have access, show the access control component
  if (!hasAccess) {
    return <OrganizationAccessControl onAccessGranted={() => {
      handleAccessGranted();
      // Force sync requests
      forceSyncRequests();
    }} />;
  }

  // Organization information (in a real app, this would come from context or state)
  const organization = localStorage.getItem("organizationAccess") || "Organization";
  const userEmail = localStorage.getItem("supportUserEmail") || "";

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
      
      <DashboardControls
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        newRequestCount={newRequestCount}
        forceSyncRequests={forceSyncRequests}
        activeTab={activeTab}
        resetNotificationCount={resetNotificationCount}
      />
      
      <DashboardContent
        activeMode={activeMode}
        activeTab={activeTab}
        syncTimer={syncTimer}
        requests={requests}
        formatDate={formatDate}
        acceptRequest={acceptRequest}
        completeRequest={completeRequest}
        addNote={addNote}
        clearRequest={clearRequest}
        undoClearRequest={undoClearRequest}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default SupportDashboard;

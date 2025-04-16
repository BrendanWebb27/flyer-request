
import React, { useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useActiveRequests } from "@/hooks/useActiveRequests";
import ActiveRequestsTabs from "@/components/requests/ActiveRequestsTabs";
import ActiveRequestsTabsContent from "@/components/requests/ActiveRequestsTabsContent";

const ActiveRequests: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filteredRequests,
    availableTabs,
    refreshCount,
    handleClearRequest,
    handleAcceptRequest,
    handleRequestUpdated,
    updateUrlWithActiveTab,
    formatDate,
    currentUserId,
    isSupport,
    requests
  } = useActiveRequests();

  // Update URL when tab changes - with debouncing to prevent multiple updates
  useEffect(() => {
    const timeoutId = setTimeout(updateUrlWithActiveTab, 100);
    return () => clearTimeout(timeoutId);
  }, [activeTab, updateUrlWithActiveTab]);

  // Update active tab when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get("status");
    
    if (statusParam && ["pending", "active", "completed"].includes(statusParam)) {
      setActiveTab(statusParam);
    } else if (statusParam === null) {
      setActiveTab("all");
    }
  }, [setActiveTab]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ActiveRequestsTabs 
          availableTabs={availableTabs} 
          requests={requests} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <ActiveRequestsTabsContent 
          availableTabs={availableTabs}
          filteredRequests={filteredRequests}
          formatDate={formatDate}
          onClearRequest={handleClearRequest}
          currentUserId={currentUserId}
          onAcceptRequest={isSupport ? handleAcceptRequest : undefined}
          onRequestUpdated={handleRequestUpdated}
          refreshCount={refreshCount}
        />
      </Tabs>
    </div>
  );
};

export default ActiveRequests;

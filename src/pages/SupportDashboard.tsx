
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { TabsContent } from "@/components/ui/tabs";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { useLocation, useNavigate } from "react-router-dom";
import { RequestStatus } from "@/types/request";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateUserActivityTimestamp, clearExpiredUserData } from "@/utils/userDataExpiration";
import { forceRequestSync } from "@/utils/requestPersistence";
import { getSupportAccess } from "@/utils/supportAccess";

// Component imports
import OrganizationAccessControl from "@/components/OrganizationAccessControl";
import DashboardHeader from "@/components/support/DashboardHeader";
import DashboardMetrics from "@/components/support/DashboardMetrics";
import RequestTabs from "@/components/support/RequestTabs";
import RequestsTable from "@/components/support/RequestsTable";
import UserLookup from "@/components/support/UserLookup";

// Add Button and RefreshCcw imports
import { Button } from "@/components/ui/button";
import { RefreshCcw, Bell } from "lucide-react";
import { toast } from "sonner";

const SupportDashboard: React.FC = () => {
  const { toast: uiToast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [syncTimer, setSyncTimer] = useState(0); // Timer state to trigger updates
  const [newRequestCount, setNewRequestCount] = useState(0);
  
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
  
  // Force sync requests periodically
  const forceSyncRequests = useCallback(() => {
    console.log("Support Dashboard: Forcing request sync");
    forceRequestSync();
    setSyncTimer(prev => prev + 1);
  }, []);
  
  // Handle new request notifications
  useEffect(() => {
    const handleNewRequest = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.request) {
        const request = customEvent.detail.request;
        
        // Show notification using Sonner toast for a more visible notification
        toast.success(`New Request: ${request.id}`, {
          description: `From: ${request.requestedBy} - Location: ${request.location}`,
          duration: 5000,
          action: {
            label: "View",
            onClick: () => {
              // Navigate to pending tab
              navigate("/support?status=pending");
              // Select pending tab if not already selected
              if (activeTab !== "pending") {
                setActiveTab("pending");
              }
              // Force refresh
              forceSyncRequests();
            }
          }
        });
        
        // Play sound for notification (optional)
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Audio play prevented by browser policy'));
        } catch (e) {
          console.log('Audio notification not supported');
        }
        
        // Increment new request counter
        setNewRequestCount(prev => prev + 1);
      }
    };
    
    // Listen for new request events
    window.addEventListener('supportNewRequest', handleNewRequest);
    
    // Listen for storage events that might indicate new requests
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('request_notification_')) {
        try {
          const data = JSON.parse(event.newValue || '{}');
          if (data.type === 'new_request') {
            // Force a refresh when a new request comes in
            forceSyncRequests();
            setNewRequestCount(prev => prev + 1);
          }
        } catch (e) {
          console.error('Error parsing notification data', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('supportNewRequest', handleNewRequest);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [forceSyncRequests, navigate, activeTab]);
  
  // Set up periodic sync
  useEffect(() => {
    // Force sync on component mount
    forceSyncRequests();
    
    // Set up interval for periodic syncing
    const syncInterval = setInterval(() => {
      forceSyncRequests();
    }, 10000); // Sync every 10 seconds
    
    return () => clearInterval(syncInterval);
  }, [forceSyncRequests]);
  
  // Check if user data has expired and if user has already been granted access
  useEffect(() => {
    // Check for data expiration first
    const wasDataCleared = clearExpiredUserData();
    
    if (wasDataCleared) {
      setHasAccess(false);
      return;
    }
    
    // If data wasn't cleared, check for access
    const accessGranted = getSupportAccess();
    if (accessGranted) {
      setHasAccess(true);
      // Update activity timestamp when the user accesses the dashboard
      updateUserActivityTimestamp();
      
      // Force sync requests
      forceSyncRequests();
    }
  }, [forceSyncRequests]);

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
      // Force sync requests
      forceSyncRequests();
    }} />;
  }

  // Organization information (in a real app, this would come from context or state)
  const organization = localStorage.getItem("organizationAccess") || "Organization";
  const userEmail = localStorage.getItem("supportUserEmail") || "";

  // Update activity timestamp on user interactions
  const handleUserInteraction = () => {
    updateUserActivityTimestamp();
  };
  
  // Handler for when a new tab is selected
  const handleTabChange = (value: string) => {
    // Reset notification counter when viewing pending requests
    if (value === "pending") {
      setNewRequestCount(0);
    }
    
    // Force sync when changing tabs
    forceSyncRequests();
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
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="sm"
            onClick={forceSyncRequests}
            className="flex items-center gap-1"
          >
            <RefreshCcw size={14} />
            Sync
          </Button>
          
          {newRequestCount > 0 && activeTab !== "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate("/support?status=pending");
                setNewRequestCount(0);
                forceSyncRequests();
              }}
              className="flex items-center gap-1 bg-amber-50 border-amber-200 text-amber-700"
            >
              <Bell size={14} />
              {newRequestCount} New {newRequestCount === 1 ? 'Request' : 'Requests'}
            </Button>
          )}
          
          <Tabs value={activeMode} onValueChange={(v) => {
            setActiveMode(v as "requests" | "users");
            forceSyncRequests();
          }}>
            <TabsList>
              <TabsTrigger value="requests">Support Requests</TabsTrigger>
              <TabsTrigger value="users">User Verification</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {activeMode === "users" ? (
        <UserLookup />
      ) : (
        <RequestTabs defaultValue={activeTab} onTabChange={handleTabChange}>
          {["all", "pending", "active", "completed"].map((tab) => (
            <TabsContent key={`${tab}-content-${syncTimer}`} value={tab}>
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

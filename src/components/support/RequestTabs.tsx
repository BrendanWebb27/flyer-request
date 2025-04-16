
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

interface RequestTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const RequestTabs: React.FC<RequestTabsProps> = ({ 
  children, 
  defaultValue = "all" 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract status from URL if we're on the support dashboard
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status");
  const [activeTab, setActiveTab] = useState<string>(statusParam || defaultValue);
  
  // Update URL when tab changes in support dashboard
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (location.pathname === "/support") {
      if (value !== "all") {
        navigate(`/support?status=${value}`, { replace: true });
      } else {
        navigate("/support", { replace: true });
      }
    }
    
    if (location.pathname === "/active") {
      if (value !== "all") {
        navigate(`/active?status=${value}`, { replace: true });
      } else {
        navigate("/active", { replace: true });
      }
    }
  };

  // Update active tab when URL changes
  useEffect(() => {
    const currentStatus = urlParams.get("status");
    
    if (currentStatus && ["pending", "active", "completed", "all"].includes(currentStatus)) {
      if (currentStatus !== activeTab) {
        setActiveTab(currentStatus);
      }
    } else if (!currentStatus) {
      if (activeTab !== "all") {
        setActiveTab("all");
      }
    }
  }, [location.search, urlParams]);

  // Listen for status change events
  useEffect(() => {
    const handleStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.newStatus === 'active') {
        if (location.pathname === "/active") {
          setActiveTab('active');
        }
      }
    };
    
    window.addEventListener('requestStatusChanged', handleStatusChange);
    return () => window.removeEventListener('requestStatusChanged', handleStatusChange);
  }, [location.pathname]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default RequestTabs;

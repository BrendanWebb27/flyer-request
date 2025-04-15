
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
  };

  // Update active tab when URL changes
  useEffect(() => {
    if (statusParam && ["pending", "active", "completed", "all"].includes(statusParam)) {
      setActiveTab(statusParam);
    } else if (!statusParam && location.pathname === "/support") {
      setActiveTab("all");
    }
  }, [statusParam, location.pathname]);

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

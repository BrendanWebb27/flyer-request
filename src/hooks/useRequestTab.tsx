
import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RequestStatus } from "@/types/request";

export const useRequestTab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get status from URL params
  const urlParams = new URLSearchParams(location.search);
  const statusParam = urlParams.get("status") as RequestStatus | null;
  const [activeTab, setActiveTab] = useState<string>(statusParam || "all");

  // Sync URL with tab state
  useEffect(() => {
    if (statusParam !== activeTab && statusParam) {
      console.log("Syncing activeTab with URL param:", statusParam);
      setActiveTab(statusParam);
    } else if (!statusParam && activeTab !== "all") {
      console.log("No status in URL, setting activeTab to all");
      setActiveTab("all");
    }
  }, [statusParam, location.search]);

  // Update the URL when the active tab changes
  const updateUrlWithActiveTab = useCallback(() => {
    if (statusParam !== activeTab && activeTab !== "all") {
      navigate(`/active?status=${activeTab}`, { replace: true });
    } else if (statusParam !== activeTab && activeTab === "all") {
      navigate(`/active`, { replace: true });
    }
  }, [activeTab, navigate, statusParam]);

  return {
    activeTab,
    setActiveTab,
    updateUrlWithActiveTab
  };
};

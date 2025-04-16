
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Home,
  FileText,
  Clock,
  UserCircle,
  Menu,
  HeadphonesIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type UserRole = "support" | "general";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isSupport, getSupportAccess } = useProfileAccess();
  const { openMobile, setOpenMobile } = useSidebar();
  
  // State to manage the user role
  const [userRole, setUserRole] = useState<UserRole>("general");
  
  // Update role when support status changes
  useEffect(() => {
    const hasSupport = getSupportAccess();
    console.log("Sidebar checking support status:", hasSupport);
    
    setUserRole(hasSupport ? "support" : "general");
  }, [isSupport, getSupportAccess]);

  // Fixed isActiveRoute function that properly checks for exact route matches
  const isActiveRoute = (route: string) => {
    if (route.includes("?")) {
      // For routes with query parameters, check the pathname matches and query params match exactly
      const [path, query] = route.split("?");
      
      // Check if pathname matches
      if (location.pathname !== path) return false;
      
      // For status param routes, check exact match
      const routeParams = new URLSearchParams(query);
      const currentParams = new URLSearchParams(location.search);
      
      const routeStatus = routeParams.get("status");
      const currentStatus = currentParams.get("status");
      
      // Only return true if the status matches exactly
      return routeStatus === currentStatus;
    }
    
    // For routes without query params, must be exact path match with no query params
    return location.pathname === route && location.search === "";
  };

  // Handle menu item click - close the mobile sidebar when an item is clicked
  const handleItemClick = () => {
    if (openMobile) {
      setOpenMobile(false);
    }
  };

  // Check current role on component mount
  useEffect(() => {
    const hasSupport = getSupportAccess();
    console.log("Sidebar initial support check:", hasSupport);
    
    // Force update of role based on localStorage
    setUserRole(hasSupport ? "support" : "general");
    
    // Listen for storage events that might indicate support status changes
    const handleStorageChange = () => {
      const newSupportStatus = getSupportAccess();
      console.log("Storage changed, new support status:", newSupportStatus);
      setUserRole(newSupportStatus ? "support" : "general");
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [getSupportAccess]);

  // Define navigation items based on user role
  const generalUserNavItems = [
    {
      icon: Home,
      label: "Dashboard",
      route: "/dashboard",
    },
    {
      icon: FileText,
      label: "New Request",
      route: "/request",
    },
    {
      icon: Clock,
      label: "Active Requests",
      route: "/active",
    },
    {
      icon: AlertCircle,
      label: "Pending Requests",
      route: "/active?status=pending",
    },
    {
      icon: UserCircle,
      label: "Profile",
      route: "/profile",
    },
  ];

  // Simplifying the support navigation - removing redundant items
  const supportUserNavItems = [
    {
      icon: HeadphonesIcon, 
      label: "Support Dashboard",
      route: "/support",
    },
    {
      icon: UserCircle,
      label: "Profile",
      route: "/profile",
    },
  ];

  // Choose navigation items based on user role
  const navItems = userRole === "support" ? supportUserNavItems : generalUserNavItems;

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger>
          <button className="p-2 rounded-md bg-flyerPurple-600 text-white hover:bg-flyerPurple-700 transition-colors shadow-lg">
            <Menu size={24} />
          </button>
        </SidebarTrigger>
      </div>
      <SidebarComponent>
        <SidebarHeader className="p-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white">FlyerRequest</h1>
          {userRole === "support" && (
            <div className="mt-1 px-2 py-1 bg-green-500 text-xs font-medium rounded-full text-white">
              Support Staff
            </div>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.route}>
                <SidebarMenuButton>
                  <Link
                    to={item.route}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActiveRoute(item.route)
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={handleItemClick}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarComponent>
    </>
  );
};

export default Sidebar;

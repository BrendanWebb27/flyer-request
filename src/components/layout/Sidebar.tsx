
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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
  
  // In a real app, this would come from auth context or state
  // For this example, we'll check localStorage to determine the role
  const [userRole, setUserRole] = useState<UserRole>("general");
  
  useEffect(() => {
    const hasAccess = localStorage.getItem("supportAccessGranted") === "true";
    setUserRole(hasAccess ? "support" : "general");
  }, [location.pathname]); // Re-check on route change

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

  const navItems = [
    {
      icon: Home,
      label: "Dashboard",
      route: "/dashboard",
      roles: ["general", "support"],
    },
    {
      icon: FileText,
      label: "New Request",
      route: "/request",
      roles: ["general", "support"],
    },
    {
      icon: Clock,
      label: "Active Requests",
      route: "/active",
      roles: ["general", "support"],
    },
    {
      icon: AlertCircle,
      label: "Pending Requests",
      route: "/active?status=pending",
      roles: ["general", "support"],
    },
    {
      icon: CheckCircle2,
      label: "Completed Requests",
      route: "/active?status=completed",
      roles: ["support"],
    },
    {
      icon: HeadphonesIcon,
      label: "Support Dashboard",
      route: "/support",
      roles: ["support"],
    },
    {
      icon: UserCircle,
      label: "Profile",
      route: "/profile",
      roles: ["general", "support"],
    },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger>
          <button className="p-2 rounded-md bg-flyerPurple-500 text-white hover:bg-flyerPurple-600 transition-colors">
            <Menu size={20} />
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
            {filteredNavItems.map((item) => (
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
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* Removed SidebarFooter with sign out button */}
      </SidebarComponent>
    </>
  );
};

export default Sidebar;

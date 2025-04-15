
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
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
  LogOut,
  Menu,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  const navItems = [
    {
      icon: Home,
      label: "Dashboard",
      route: "/",
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
      icon: UserCircle,
      label: "Profile",
      route: "/profile",
    },
  ];

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger asChild>
          <button className="p-2 rounded-md bg-flyerPurple-500 text-white hover:bg-flyerPurple-600 transition-colors">
            <Menu size={20} />
          </button>
        </SidebarTrigger>
      </div>
      <SidebarComponent>
        <SidebarHeader className="p-4 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white">FlyerRequest</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.route}>
                <SidebarMenuButton asChild>
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
        <SidebarFooter className="p-4">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </SidebarFooter>
      </SidebarComponent>
    </>
  );
};

export default Sidebar;

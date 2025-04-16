
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle2, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { useProfileAccess } from "@/hooks/useProfileAccess";
import { loadRequests } from "@/utils/requestPersistence";

const Dashboard: React.FC = () => {
  const { requests, metrics } = useSupportRequests();
  const { getUserProfile } = useProfileAccess();
  
  // Get current user email for request filtering
  const currentUserEmail = localStorage.getItem("supportUserEmail") || "user@example.com";
  console.log("Dashboard: Current user email:", currentUserEmail);
  
  // Filter requests to only show the current user's requests
  const userRequests = requests.filter(req => {
    console.log(`Dashboard: Checking request ${req.id} - requestedBy: ${req.requestedBy}, current: ${currentUserEmail}`);
    return req.requestedBy === currentUserEmail;
  });
  
  console.log(`Dashboard: Found ${userRequests.length} requests for current user`);
  
  // Calculate request statistics
  const activeCount = userRequests.filter(req => req.status === "active").length;
  const completedCount = userRequests.filter(req => req.status === "completed").length;
  const pendingCount = userRequests.filter(req => req.status === "pending").length;
  
  console.log(`Dashboard: Stats - active: ${activeCount}, completed: ${completedCount}, pending: ${pendingCount}`);
  
  // Get recent requests (limited to 3)
  const recentRequests = [...userRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = [
    { 
      title: "Active Requests", 
      value: activeCount.toString(), 
      icon: Clock, 
      color: "bg-blue-500",
      link: "/active?status=active"
    },
    { 
      title: "Completed Requests", 
      value: completedCount.toString(), 
      icon: CheckCircle2, 
      color: "bg-green-500",
      link: "/active?status=completed"
    },
    { 
      title: "Pending Approval", 
      value: pendingCount.toString(), 
      icon: AlertCircle, 
      color: "bg-yellow-500",
      link: "/active?status=pending"
    },
  ];
  
  // Function to force refresh requests
  const handleRefresh = () => {
    console.log("Dashboard: Manual refresh triggered");
    const freshRequests = loadRequests();
    console.log(`Dashboard: Refreshed with ${freshRequests.length} requests`);
    window.dispatchEvent(new CustomEvent('requestsForceSync', {
      detail: {
        timestamp: new Date().toISOString(),
        forceSync: true
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            title="Refresh requests"
            className="mr-2"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Link to="/request">
            <Button className="bg-flyerPurple-600 hover:bg-flyerPurple-700">
              New Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link} className="block">
            <Card className="transition-all hover:shadow-md hover:border-flyerPurple-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>View your most recent flyer requests</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <Link key={request.id} to={`/active?id=${request.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm hover:border-flyerPurple-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <MapPin className="h-4 w-4 text-flyerPurple-500" />
                      </div>
                      <div>
                        <p className="font-medium">{request.id}</p>
                        <p className="text-sm text-muted-foreground">{request.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`inline-flex h-2 w-2 rounded-full ${
                            request.status === "active" ? "bg-green-500" : 
                            request.status === "pending" ? "bg-yellow-500" : "bg-gray-400"
                          }`}
                        />
                        <p className="text-sm">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No requests found</p>
                <div className="flex flex-col items-center gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw size={16} className="mr-2" />
                    Refresh Requests
                  </Button>
                  <Link to="/request" className="mt-2 inline-flex items-center text-sm text-flyerPurple-600 hover:underline">
                    Create your first request <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            )}
            {recentRequests.length > 0 && (
              <Link to="/active" className="flex items-center justify-center text-sm text-flyerPurple-600 hover:underline">
                View all requests <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

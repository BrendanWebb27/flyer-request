
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Clock, User, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Request, RequestStatus } from "@/components/support/RequestsTable";
import { useSupportRequests } from "@/hooks/useSupportRequests";

const ActiveRequests: React.FC = () => {
  const { toast } = useToast();
  const { requests, formatDate, clearRequest, undoClearRequest } = useSupportRequests();
  const [recentlyCleared, setRecentlyCleared] = useState<{id: string, index: number} | null>(null);
  
  // Filter to just the current user's requests (in a real app, this would use authentication)
  // Here we're mocking it with a user ID
  const currentUserId = "user123"; // This would come from authentication in a real app
  const userRequests = requests.filter(request => request.requestedBy === currentUserId);
  
  const handleClearRequest = (id: string) => {
    const requestIndex = requests.findIndex(req => req.id === id);
    clearRequest(id);
    
    setRecentlyCleared({ id, index: requestIndex });
    
    toast({
      title: "Request Cleared",
      description: "Request has been cleared from your view",
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (recentlyCleared) {
              undoClearRequest(recentlyCleared.id, recentlyCleared.index);
              setRecentlyCleared(null);
              toast({
                title: "Request Restored",
                description: "Request has been restored to your view"
              });
            }
          }}
        >
          Undo
        </Button>
      )
    });
    
    // Clear the recently cleared item after a timeout
    setTimeout(() => {
      setRecentlyCleared(null);
    }, 10000); // 10 seconds
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500 animate-pulse-light";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const filteredRequests = (status: RequestStatus | "all") => {
    if (status === "all") return userRequests;
    return userRequests.filter(request => request.status === status);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "pending", "active", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filteredRequests(tab as RequestStatus | "all").length === 0 ? (
              <div className="text-center p-10">
                <p className="text-muted-foreground">No {tab === "all" ? "" : tab} requests found.</p>
              </div>
            ) : (
              filteredRequests(tab as RequestStatus | "all").map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-3 w-3 rounded-full ${getStatusColor(request.status)}`} />
                          <Badge variant="outline" className="font-medium">
                            {getStatusText(request.status)}
                          </Badge>
                          <span className="text-sm font-medium text-muted-foreground">
                            {request.id}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <MapPin size={18} className="text-flyerPurple-500" />
                          {request.location}
                        </h3>
                        
                        <p className="text-muted-foreground">{request.details}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                          
                          {request.estimatedDuration && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{request.estimatedDuration}</span>
                            </div>
                          )}
                          
                          {request.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>Assigned to: {request.assignedTo}</span>
                            </div>
                          )}

                          {request.estimatedArrival && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>Arrives in: {request.estimatedArrival}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 self-end md:self-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Clear
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Clear this request?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the request from your view. You can undo this action for a short time after clearing.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleClearRequest(request.id)}>
                                Clear Request
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <Button 
                          size="sm" 
                          className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ActiveRequests;

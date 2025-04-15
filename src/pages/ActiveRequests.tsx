
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RequestStatus = "pending" | "active" | "completed" | "cancelled";

interface Request {
  id: string;
  location: string;
  details: string;
  createdAt: string;
  status: RequestStatus;
  estimatedDuration: string;
  assignedTo?: string;
}

const ActiveRequests: React.FC = () => {
  const { toast } = useToast();
  // Mock data for requests
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "REQ-1234",
      location: "Building A, Room 105",
      details: "Need assistance with carrying boxes to the mail room",
      createdAt: "2025-04-15T09:30:00Z",
      status: "active",
      estimatedDuration: "15 minutes",
      assignedTo: "John Doe"
    },
    {
      id: "REQ-1235",
      location: "Building B, Conference Room 3",
      details: "Help required with setting up projector for presentation",
      createdAt: "2025-04-15T10:15:00Z",
      status: "active",
      estimatedDuration: "30 minutes",
      assignedTo: "Sarah Johnson"
    },
    {
      id: "REQ-1236",
      location: "Building C, Cafeteria",
      details: "Need assistance with food delivery for event",
      createdAt: "2025-04-15T08:45:00Z",
      status: "pending",
      estimatedDuration: "45 minutes"
    },
    {
      id: "REQ-1232",
      location: "Building D, Room 201",
      details: "Document delivery to HR department",
      createdAt: "2025-04-14T14:20:00Z",
      status: "completed",
      estimatedDuration: "10 minutes",
      assignedTo: "Mike Wilson"
    },
    {
      id: "REQ-1230",
      location: "Building A, Room 302",
      details: "Technical equipment transport",
      createdAt: "2025-04-14T11:05:00Z",
      status: "cancelled",
      estimatedDuration: "20 minutes"
    }
  ]);

  const cancelRequest = (id: string) => {
    setRequests(
      requests.map(request =>
        request.id === id ? { ...request, status: "cancelled" } : request
      )
    );
    
    toast({
      title: "Request Cancelled",
      description: `Request ${id} has been cancelled`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500 animate-pulse-light";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
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
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredRequests = (status: RequestStatus | "all") => {
    if (status === "all") return requests;
    return requests.filter(request => request.status === status);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Requests</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        {["all", "pending", "active", "completed", "cancelled"].map((tab) => (
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
                          <Badge variant={request.status === 'cancelled' ? 'destructive' : 'outline'} className="font-medium">
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
                          
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{request.estimatedDuration}</span>
                          </div>
                          
                          {request.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{request.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 self-end md:self-center">
                        {request.status === "pending" || request.status === "active" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => cancelRequest(request.id)}
                          >
                            Cancel
                          </Button>
                        ) : null}
                        
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

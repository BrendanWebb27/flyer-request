
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Clock, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RequestActionPanel from "@/components/RequestActionPanel";

type RequestStatus = "pending" | "active" | "completed" | "cancelled";

interface Request {
  id: string;
  location: string;
  details: string;
  createdAt: string;
  status: RequestStatus;
  estimatedDuration: string;
  assignedTo?: string;
  estimatedArrival?: string;
}

const SupportDashboard: React.FC = () => {
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
      assignedTo: "John Doe",
      estimatedArrival: "10 minutes"
    },
    {
      id: "REQ-1235",
      location: "Building B, Conference Room 3",
      details: "Help required with setting up projector for presentation",
      createdAt: "2025-04-15T10:15:00Z",
      status: "active",
      estimatedDuration: "30 minutes",
      assignedTo: "Sarah Johnson",
      estimatedArrival: "5 minutes"
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
      id: "REQ-1237",
      location: "Building A, Room 302",
      details: "Assist with moving furniture for event setup",
      createdAt: "2025-04-15T11:20:00Z",
      status: "pending",
      estimatedDuration: "30 minutes"
    },
    {
      id: "REQ-1238",
      location: "Building D, Lobby",
      details: "Delivery of package from mailroom",
      createdAt: "2025-04-15T09:15:00Z",
      status: "pending",
      estimatedDuration: "10 minutes"
    }
  ]);

  const acceptRequest = (id: string, data: { assignedTo: string; estimatedTime: string }) => {
    setRequests(
      requests.map(request =>
        request.id === id ? { 
          ...request, 
          status: "active", 
          assignedTo: data.assignedTo,
          estimatedArrival: data.estimatedTime 
        } : request
      )
    );
  };

  const completeRequest = (id: string) => {
    setRequests(
      requests.map(request =>
        request.id === id ? { ...request, status: "completed" } : request
      )
    );
    
    toast({
      title: "Request Completed",
      description: `Request ${id} has been marked as completed`,
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

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const filteredRequests = (status: RequestStatus | "all") => {
    if (status === "all") return requests;
    return requests.filter(request => request.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-bold">{requests.filter(r => r.status === "pending").length}</p>
              </div>
              <div className="p-2 rounded-full bg-yellow-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                <p className="text-3xl font-bold">{requests.filter(r => r.status === "active").length}</p>
              </div>
              <div className="p-2 rounded-full bg-green-500">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-3xl font-bold">{requests.filter(r => r.status === "completed").length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {["all", "pending", "active", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>Request Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Est. Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests(tab as RequestStatus | "all").length > 0 ? (
                      filteredRequests(tab as RequestStatus | "all").map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.id}</TableCell>
                          <TableCell>{request.location}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>{request.estimatedDuration}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {request.status === "pending" && (
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">Accept</Button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>Accept Request {request.id}</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-4">
                                      <RequestActionPanel 
                                        requestId={request.id} 
                                        onAccept={(data) => acceptRequest(request.id, data)} 
                                      />
                                    </div>
                                  </SheetContent>
                                </Sheet>
                              )}
                              
                              {request.status === "active" && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                                  onClick={() => completeRequest(request.id)}
                                >
                                  Complete
                                </Button>
                              )}
                              
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No {tab === "all" ? "" : tab} requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SupportDashboard;

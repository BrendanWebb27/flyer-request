
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import RequestActionPanel from "@/components/RequestActionPanel";
import { Request, RequestStatus, Note } from "@/types/request";

interface RequestsTableProps {
  requests: Request[];
  activeTab: string;
  formatDate: (dateString: string) => string;
  acceptRequest: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  completeRequest: (id: string, note?: { text: string, author: string }) => void;
  addNote?: (id: string, note: { text: string, author: string }) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  activeTab,
  formatDate,
  acceptRequest,
  completeRequest,
  addNote
}) => {
  const [completionNote, setCompletionNote] = useState("");
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<Array<{ text: string }>>([]);

  const filteredRequests = (status: RequestStatus | "all") => {
    if (status === "all") return requests;
    return requests.filter(request => request.status === status);
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

  const handleCompleteWithNote = (id: string) => {
    if (completionNote.trim()) {
      completeRequest(id, { 
        text: completionNote, 
        author: "Support Staff" // In a real app, this would be the current user
      });
    } else {
      completeRequest(id);
    }
    setCompletionNote("");
    setActiveRequest(null);
    setAdditionalNotes([]);
  };
  
  const addAdditionalNote = () => {
    setAdditionalNotes([...additionalNotes, { text: "" }]);
  };
  
  const updateAdditionalNote = (index: number, text: string) => {
    const updatedNotes = [...additionalNotes];
    updatedNotes[index].text = text;
    setAdditionalNotes(updatedNotes);
  };
  
  const submitAdditionalNotes = (id: string) => {
    if (addNote) {
      additionalNotes.forEach(note => {
        if (note.text.trim()) {
          addNote(id, {
            text: note.text,
            author: "Support Staff" // In a real app, this would be the current user
          });
        }
      });
    }
  };

  return (
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
            {filteredRequests(activeTab as RequestStatus | "all").length > 0 ? (
              filteredRequests(activeTab as RequestStatus | "all").map((request) => (
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
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                              onClick={() => setActiveRequest(request.id)}
                            >
                              Complete
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Complete Request {request.id}</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="completionNote" className="flex items-center gap-2">
                                  <FileText size={16} className="text-flyerPurple-500" />
                                  Completion Note
                                </Label>
                                <Textarea 
                                  id="completionNote"
                                  placeholder="What was done to complete this request?"
                                  value={completionNote}
                                  onChange={(e) => setCompletionNote(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              
                              {additionalNotes.map((note, index) => (
                                <div key={index} className="space-y-2">
                                  <Label htmlFor={`additionalNote-${index}`}>
                                    Additional Note {index + 1}
                                  </Label>
                                  <Textarea 
                                    id={`additionalNote-${index}`}
                                    placeholder="Add more details..."
                                    value={note.text}
                                    onChange={(e) => updateAdditionalNote(index, e.target.value)}
                                    rows={3}
                                  />
                                </div>
                              ))}
                              
                              <div className="flex gap-2">
                                <Button 
                                  type="button"
                                  variant="outline"
                                  onClick={addAdditionalNote}
                                >
                                  Add Another Note
                                </Button>
                              </div>
                              
                              <Button 
                                className="w-full"
                                onClick={() => {
                                  handleCompleteWithNote(request.id);
                                  submitAdditionalNotes(request.id);
                                }}
                              >
                                Mark as Complete
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
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
                  No {activeTab === "all" ? "" : activeTab} requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RequestsTable;

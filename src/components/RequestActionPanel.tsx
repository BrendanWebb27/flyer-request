
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Clock, Users } from "lucide-react";

interface RequestActionPanelProps {
  requestId: string;
  onAccept: (data: { assignedTo: string; estimatedTime: string }) => void;
}

const RequestActionPanel: React.FC<RequestActionPanelProps> = ({
  requestId,
  onAccept
}) => {
  const { toast } = useToast();
  const [assignedTo, setAssignedTo] = React.useState("");
  const [estimatedTime, setEstimatedTime] = React.useState("");
  
  const handleAccept = () => {
    if (!assignedTo || !estimatedTime) {
      toast({
        title: "Missing information",
        description: "Please select who will fulfill the request and the estimated time of arrival.",
        variant: "destructive"
      });
      return;
    }
    
    onAccept({
      assignedTo,
      estimatedTime
    });
    
    toast({
      title: "Request Accepted",
      description: `Request ${requestId} has been accepted and assigned to ${assignedTo}.`,
    });
    
    // Force a page refresh after a short delay to update the UI
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
  };
  
  // Mock data for available personnel
  const availablePersonnel = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Mike Wilson" },
    { id: "4", name: "Emily Brown" }
  ];
  
  // Time options
  const timeOptions = [
    "5 minutes",
    "10 minutes",
    "15 minutes", 
    "20 minutes",
    "30 minutes",
    "45 minutes",
    "1 hour"
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Accept Request</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="assignedTo" className="flex items-center gap-2">
            <Users size={16} className="text-flyerPurple-500" />
            Assign To
          </Label>
          <Select
            value={assignedTo}
            onValueChange={setAssignedTo}
          >
            <SelectTrigger id="assignedTo">
              <SelectValue placeholder="Select personnel" />
            </SelectTrigger>
            <SelectContent>
              {availablePersonnel.map((person) => (
                <SelectItem key={person.id} value={person.name}>
                  {person.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedTime" className="flex items-center gap-2">
            <Clock size={16} className="text-flyerPurple-500" />
            Estimated Time of Arrival
          </Label>
          <Select
            value={estimatedTime}
            onValueChange={setEstimatedTime}
          >
            <SelectTrigger id="estimatedTime">
              <SelectValue placeholder="Select estimated time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleAccept}
          className="w-full bg-flyerPurple-600 hover:bg-flyerPurple-700"
        >
          <Check size={16} className="mr-2" />
          Accept Request
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequestActionPanel;

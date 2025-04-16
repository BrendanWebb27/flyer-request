
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Check } from "lucide-react";

interface AcceptRequestSectionProps {
  requestId: string;
  onAccept: (id: string, data: { assignedTo: string; estimatedTime: string }) => void;
  highlightAccept?: boolean;
}

const AcceptRequestSection: React.FC<AcceptRequestSectionProps> = ({ 
  requestId,
  onAccept,
  highlightAccept = false
}) => {
  const [estimatedTime, setEstimatedTime] = useState("");
  
  // Accept request - with stopPropagation
  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (estimatedTime) {
      onAccept(requestId, { 
        assignedTo: "Current Support Staff", // Fixed default value
        estimatedTime 
      });
    }
  };

  // Time options for support staff
  const timeOptions = ["5 minutes", "10 minutes", "15 minutes", "20 minutes", "30 minutes", "45 minutes", "1 hour"];
  
  return (
    <div className={`space-y-4 border-t pt-4 mt-4 ${highlightAccept ? 'bg-flyerPurple-50 p-4 rounded-lg border border-flyerPurple-200' : ''}`}>
      <h4 className={`font-medium ${highlightAccept ? 'text-flyerPurple-700' : ''}`}>
        {highlightAccept ? 'Accept This Request' : 'Accept Request'}
      </h4>
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
        className={`w-full ${highlightAccept ? 'bg-flyerPurple-600 hover:bg-flyerPurple-700 text-lg py-6' : 'bg-flyerPurple-600 hover:bg-flyerPurple-700'}`}
        disabled={!estimatedTime}
        id="acceptRequestButton"
      >
        <Check size={highlightAccept ? 20 : 16} className="mr-2" />
        {highlightAccept ? 'Accept Request Now' : 'Accept Request'}
      </Button>
    </div>
  );
};

export default AcceptRequestSection;

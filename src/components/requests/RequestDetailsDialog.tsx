
import React, { useState } from "react";
import { Request } from "@/types/request";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import RequestStatusBadge from "./RequestStatusBadge";
import RequestDetailsItem from "./RequestDetailsItem";
import RequestDetailsNotes from "./RequestDetailsNotes";

interface RequestDetailsDialogProps {
  request: Request;
  onAccept?: (id: string, data: { estimatedTime: string }) => void;
}

const formSchema = z.object({
  estimatedTime: z.string().min(1, "Estimated time is required"),
});

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ request, onAccept }) => {
  const [showTimeInput, setShowTimeInput] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estimatedTime: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (onAccept) {
      // Convert input to format: "X minutes"
      const formattedTime = `${values.estimatedTime} minutes`;
      onAccept(request.id, { estimatedTime: formattedTime });
      
      toast({
        title: "Request Accepted",
        description: `You'll arrive in ${formattedTime}.`,
      });
      
      setShowTimeInput(false);
    }
  };

  const isPending = request.status === "pending";

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Request {request.id}</DialogTitle>
          <RequestStatusBadge status={request.status} />
        </div>
        <DialogDescription>
          Created on {new Date(request.createdAt).toLocaleString()}
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4 space-y-4">
        <RequestDetailsItem label="Location">
          {request.location}
        </RequestDetailsItem>
        
        <RequestDetailsItem label="Details">
          {request.details}
        </RequestDetailsItem>
        
        <RequestDetailsItem label="Requested By">
          {request.requestedBy}
        </RequestDetailsItem>
        
        {request.assignedTo && (
          <RequestDetailsItem label="Assigned To">
            {request.assignedTo}
          </RequestDetailsItem>
        )}
        
        {request.estimatedArrival && (
          <RequestDetailsItem label="Estimated Arrival">
            {request.estimatedArrival}
          </RequestDetailsItem>
        )}
        
        {request.completedAt && (
          <RequestDetailsItem label="Completed At">
            {new Date(request.completedAt).toLocaleString()}
          </RequestDetailsItem>
        )}
        
        <RequestDetailsNotes notes={request.notes} />
      </div>
      
      {isPending && !showTimeInput && (
        <DialogFooter>
          <Button 
            onClick={() => setShowTimeInput(true)}
            className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
          >
            <Check size={16} className="mr-2" />
            Accept Request
          </Button>
        </DialogFooter>
      )}
      
      {showTimeInput && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many minutes until you arrive?</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter minutes" 
                      {...field} 
                      min="1"
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTimeInput(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </>
  );
};

export default RequestDetailsDialog;

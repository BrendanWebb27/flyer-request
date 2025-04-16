
import React, { useState } from "react";
import { Request } from "@/types/request";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Check, MessageSquare } from "lucide-react";
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
  onComplete?: (id: string, note: { text: string, author: string }) => void;
  onClose?: () => void;
}

const formSchema = z.object({
  estimatedTime: z.string().min(1, "Estimated time is required"),
});

const completeFormSchema = z.object({
  completionNote: z.string().min(1, "Completion note is required"),
});

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ 
  request, 
  onAccept,
  onComplete,
  onClose
}) => {
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form for accepting requests
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estimatedTime: "",
    },
  });

  // Form for completing requests
  const completeForm = useForm<z.infer<typeof completeFormSchema>>({
    resolver: zodResolver(completeFormSchema),
    defaultValues: {
      completionNote: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("RequestDetailsDialog: Form submitted with values:", values);
    
    if (onAccept) {
      setIsSubmitting(true);
      
      try {
        // Convert input to format: "X minutes"
        const formattedTime = `${values.estimatedTime} minutes`;
        console.log("RequestDetailsDialog: Calling onAccept with:", request.id, { estimatedTime: formattedTime });
        
        // Call the accept function
        onAccept(request.id, { estimatedTime: formattedTime });
        
        // Reset form state
        form.reset();
        setShowTimeInput(false);
        
        // Close dialog if needed
        if (onClose) {
          setTimeout(() => onClose(), 200);
        }
      } catch (error) {
        console.error("Error in RequestDetailsDialog:", error);
        toast({
          title: "Error",
          description: "Failed to accept request. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCompleteSubmit = (values: z.infer<typeof completeFormSchema>) => {
    console.log("RequestDetailsDialog: Complete form submitted with values:", values);
    
    if (onComplete) {
      setIsSubmitting(true);
      
      try {
        onComplete(request.id, { 
          text: values.completionNote,
          author: "Support Staff" // In a real app, get from current user
        });
        
        // Reset form state
        completeForm.reset();
        setShowCompletionForm(false);
        
        // Close dialog if needed
        if (onClose) {
          setTimeout(() => onClose(), 200);
        }
      } catch (error) {
        console.error("Error in RequestDetailsDialog:", error);
        toast({
          title: "Error",
          description: "Failed to complete request. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Check request status - use this to determine which buttons to show
  const isPending = request.status === "pending";
  const isActive = request.status === "active";

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
      
      {/* Accept request button for pending requests */}
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
      
      {/* Complete request button for active requests */}
      {isActive && !showCompletionForm && (
        <DialogFooter>
          <Button 
            onClick={() => setShowCompletionForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check size={16} className="mr-2" />
            Complete Request
          </Button>
        </DialogFooter>
      )}
      
      {/* Form for accepting requests */}
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
                      disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Accepting..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
      
      {/* Form for completing requests */}
      {showCompletionForm && (
        <Form {...completeForm}>
          <form onSubmit={completeForm.handleSubmit(handleCompleteSubmit)} className="space-y-4">
            <FormField
              control={completeForm.control}
              name="completionNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-flyerPurple-500" />
                    Completion Note
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What was done to complete this request?" 
                      {...field} 
                      rows={4}
                      autoFocus
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCompletionForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Completing..." : "Mark as Complete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </>
  );
};

export default RequestDetailsDialog;

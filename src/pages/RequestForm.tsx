
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import RequestFormFields from '@/components/forms/RequestFormFields';
import { RequestFormData } from '@/types/request';
import { submitFlyerRequest } from '@/utils/requestSubmission';

const RequestForm: React.FC = () => {
  const form = useForm<RequestFormData>({
    defaultValues: {
      location: "",
      details: "",
      urgency: "normal",
      estimatedDuration: "15min",
      assetType: "apg-ctk"
    }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: RequestFormData) => {
    setLoading(true);
    
    try {
      await submitFlyerRequest(data);
      
      toast({
        title: "Request Submitted",
        description: "Your flyer request has been submitted successfully!",
      });
      
      navigate("/active");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Request a Flyer</h1>
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>New Flyer Request</CardTitle>
                <CardDescription>
                  Fill out the details below to request a flyer to your location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequestFormFields />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-flyerPurple-600 hover:bg-flyerPurple-700"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Submit Request <ChevronRight size={16} className="ml-1" />
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default RequestForm;

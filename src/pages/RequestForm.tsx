
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import RequestFormFields from '@/components/forms/RequestFormFields';
import { RequestFormData } from '@/types/request';
import { submitFlyerRequest } from '@/utils/requestSubmission';
import { useProfileAccess } from '@/hooks/useProfileAccess';

const RequestForm: React.FC = () => {
  const form = useForm<RequestFormData>({
    defaultValues: {
      location: "",
      details: "",
      assetType: "apg-ctk",
      secondUser: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isUserVerified } = useProfileAccess();

  // Redirect to profile if not verified
  useEffect(() => {
    if (!isUserVerified()) {
      navigate('/profile');
      toast({
        title: "Verification Required",
        description: "You need to verify your email before submitting requests.",
        variant: "destructive",
      });
    }
  }, [isUserVerified, navigate, toast]);

  const onSubmit = async (data: RequestFormData) => {
    // Extra verification check
    if (!isUserVerified()) {
      toast({
        title: "Verification Required",
        description: "You need to verify your email before submitting requests.",
        variant: "destructive",
      });
      navigate('/profile');
      return;
    }

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

  if (!isUserVerified()) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <AlertCircle className="h-12 w-12 text-amber-500" />
              <h2 className="text-xl font-medium">Verification Required</h2>
              <p className="text-muted-foreground">
                You need to verify your email before submitting requests.
              </p>
              <Button 
                onClick={() => navigate('/profile')}
                className="mt-4"
              >
                Go to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

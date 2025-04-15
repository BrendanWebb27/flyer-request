
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ChevronRight } from 'lucide-react';

type RequestFormData = {
  location: string;
  details: string;
  urgency: string;
  estimatedDuration: string;
};

const RequestForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<RequestFormData>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: RequestFormData) => {
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
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
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>New Flyer Request</CardTitle>
            <CardDescription>
              Fill out the details below to request a flyer to your location.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin size={16} className="text-flyerPurple-500" /> Location
              </Label>
              <Input
                id="location"
                placeholder="Building name, floor, room number, etc."
                {...register('location', { required: 'Location is required' })}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Request Details</Label>
              <Textarea
                id="details"
                placeholder="Describe what you need the flyer to do..."
                rows={4}
                {...register('details', { required: 'Details are required' })}
                className={errors.details ? 'border-red-500' : ''}
              />
              {errors.details && (
                <p className="text-sm text-red-500">{errors.details.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select defaultValue="normal">
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration" className="flex items-center gap-2">
                  <Clock size={16} className="text-flyerPurple-500" /> Estimated Duration
                </Label>
                <Select defaultValue="15min">
                  <SelectTrigger id="estimatedDuration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">5 minutes</SelectItem>
                    <SelectItem value="15min">15 minutes</SelectItem>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hours">2+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
    </div>
  );
};

export default RequestForm;

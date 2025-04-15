
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
import { MapPin, Clock, ChevronRight, Package } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

type RequestFormData = {
  location: string;
  details: string;
  urgency: string;
  estimatedDuration: string;
  assetType: string;
};

const assetTypes = [
  { value: "apg-ctk", label: "APG CTK", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "wpn-ctk", label: "WPN CTK", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "eng-ctk", label: "ENG CTK", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "tool-turnover", label: "Tool Turnover", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "connex", label: "CONNEX", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "tow-flex", label: "Tow Flex", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "broken-tool", label: "Broken Tool", icon: <Package className="h-4 w-4 mr-2" /> },
];

const hazLocations = [
  "A2L", "A2R", "A3L", "A3R", "A4L", "A4R", "A5L", "A5R", 
  "A6L", "A6R", "A7L", "A7R", "A8L", "A8R", "A16L", "A16R", 
  "A17L", "A17R", "A18L", "A18R", "A19L", "A19R", "B17L", 
  "B17R", "B18L", "B18R", "B19L", "B19R"
];

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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>New Flyer Request</CardTitle>
              <CardDescription>
                Fill out the details below to request a flyer to your location.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin size={16} className="text-flyerPurple-500" /> HAZ Location
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HAZ Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hazLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assetType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <Package size={16} className="text-flyerPurple-500" /> Asset Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-2"
                      >
                        {assetTypes.map((assetType) => (
                          <FormItem key={assetType.value} className="flex items-center space-x-2 space-y-0 rounded-md border p-3 cursor-pointer hover:bg-accent">
                            <FormControl>
                              <RadioGroupItem value={assetType.value} />
                            </FormControl>
                            <FormLabel className="flex items-center cursor-pointer font-normal">
                              {assetType.icon}
                              {assetType.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label htmlFor="details">Request Details</Label>
                <Textarea
                  id="details"
                  placeholder="Describe what you need the flyer to do..."
                  rows={4}
                  {...form.register('details', { required: 'Details are required' })}
                  className={form.formState.errors.details ? 'border-red-500' : ''}
                />
                {form.formState.errors.details && (
                  <p className="text-sm text-red-500">{form.formState.errors.details.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select 
                    defaultValue="normal"
                    onValueChange={(value) => form.setValue('urgency', value)}
                  >
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
                  <Select 
                    defaultValue="15min"
                    onValueChange={(value) => form.setValue('estimatedDuration', value)}
                  >
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
      </Form>
    </div>
  );
};

export default RequestForm;

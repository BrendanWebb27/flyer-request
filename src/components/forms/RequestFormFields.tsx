
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AssetTypeSelector from './AssetTypeSelector';

interface RequestFormData {
  location: string;
  details: string;
  urgency: string;
  estimatedDuration: string;
  assetType: string;
}

const RequestFormFields: React.FC = () => {
  const form = useFormContext<RequestFormData>();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin size={16} className="text-flyerPurple-500" /> HAZ Location
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter HAZ Location (e.g. A2L, B17R)" 
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="assetType"
        render={({ field }) => (
          <AssetTypeSelector 
            value={field.value} 
            onChange={field.onChange}
          />
        )}
      />
      
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you need the flyer to do..."
                  rows={4}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgency</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Clock size={16} className="text-flyerPurple-500" /> Estimated Duration
              </FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5min">5 minutes</SelectItem>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hour">1 hour</SelectItem>
                  <SelectItem value="2hours">2+ hours</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RequestFormFields;


import React from 'react';
import { MapPin } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AssetTypeSelector from './AssetTypeSelector';
import { RequestFormData } from '@/types/request';

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
    </div>
  );
};

export default RequestFormFields;

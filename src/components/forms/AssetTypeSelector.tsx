
import React from 'react';
import { Package } from 'lucide-react';
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AssetType {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const assetTypes: AssetType[] = [
  { value: "apg-ctk", label: "APG CTK", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "wpn-ctk", label: "WPN CTK", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "eng-ctk", label: "ENG CTK", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "tool-turnover", label: "Tool Turnover", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "connex", label: "CONNEX", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "tow-flex", label: "Tow Flex", icon: <Package className="h-4 w-4 mr-2" /> },
  { value: "broken-tool", label: "Broken Tool", icon: <Package className="h-4 w-4 mr-2" /> },
];

interface AssetTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AssetTypeSelector: React.FC<AssetTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <FormItem className="space-y-3">
      <FormLabel className="flex items-center gap-2">
        <Package size={16} className="text-flyerPurple-500" /> Asset Type
      </FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={onChange}
          defaultValue={value}
          className="grid grid-cols-2 gap-2"
        >
          {assetTypes.map((assetType) => (
            <FormItem 
              key={assetType.value} 
              className="flex items-center space-x-2 space-y-0 rounded-md border p-3 cursor-pointer hover:bg-accent"
            >
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
  );
};

export default AssetTypeSelector;


import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Request } from "./RequestsTable";

interface RequestTabsProps {
  children: React.ReactNode;
  defaultValue: string;
}

const RequestTabs: React.FC<RequestTabsProps> = ({ children, defaultValue }) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default RequestTabs;

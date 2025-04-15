
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-flyerPurple-600">404</h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link to="/">
          <Button className="bg-flyerPurple-600 hover:bg-flyerPurple-700">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

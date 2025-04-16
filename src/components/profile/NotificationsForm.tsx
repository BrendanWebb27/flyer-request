
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { BellRing, BellOff, Info } from "lucide-react";

interface NotificationsFormProps {
  isEditing: boolean;
}

const NotificationsForm: React.FC<NotificationsFormProps> = ({ isEditing }) => {
  const { 
    isSupported, 
    isSubscribed, 
    subscribe, 
    unsubscribe 
  } = usePushNotifications();

  // If push notifications are not supported, show message
  if (!isSupported) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BellOff className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Push notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-sm">Push notifications are not supported in this browser.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BellRing className="mr-2 h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Push notification settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Push Notifications</h4>
            <p className="text-sm text-gray-500">
              Receive notifications for request updates even when the app is closed
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Switch
                checked={isSubscribed}
                onCheckedChange={handleToggleNotifications}
              />
            ) : (
              <div className={`px-2 py-1 text-xs rounded-full ${
                isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isSubscribed ? 'Enabled' : 'Disabled'}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-4">
            <Button
              variant={isSubscribed ? "destructive" : "default"}
              onClick={handleToggleNotifications}
              className="w-full mt-2"
            >
              {isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsForm;

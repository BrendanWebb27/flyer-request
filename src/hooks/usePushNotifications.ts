
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  isPushSupported, 
  subscribeToPush, 
  getSubscription, 
  removeSubscription,
  PushSubscriptionJSON 
} from '@/utils/pushNotifications';
import { updateUserActivityTimestamp } from '@/utils/userDataExpiration';

export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState<PushSubscriptionJSON | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  // Check if notifications are supported
  useEffect(() => {
    const supported = isPushSupported();
    setIsSupported(supported);
    
    if (supported) {
      const currentSubscription = getSubscription();
      setSubscription(currentSubscription);
      setIsSubscribed(!!currentSubscription);
    }
  }, []);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    try {
      const newSubscription = await subscribeToPush();
      setSubscription(newSubscription);
      setIsSubscribed(!!newSubscription);
      updateUserActivityTimestamp();
      
      if (newSubscription) {
        toast({
          title: "Notifications Enabled",
          description: "You will now receive notifications for request updates.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to subscribe to notifications:", error);
      toast({
        title: "Notification Error",
        description: "Could not enable notifications. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    try {
      // Remove subscription
      removeSubscription();
      setSubscription(null);
      setIsSubscribed(false);
      updateUserActivityTimestamp();
      
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive notifications.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe from notifications:", error);
      toast({
        title: "Error",
        description: "Could not disable notifications. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe
  };
};

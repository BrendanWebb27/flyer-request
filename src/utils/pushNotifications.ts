
/**
 * Utilities for managing push notifications using localStorage
 */

export const saveSubscription = (subscription: PushSubscriptionJSON): void => {
  if (!subscription) return;
  localStorage.setItem('pushSubscription', JSON.stringify(subscription));
  localStorage.setItem('lastUserActivity', Date.now().toString());
};

export const getSubscription = (): PushSubscriptionJSON | null => {
  const subscription = localStorage.getItem('pushSubscription');
  return subscription ? JSON.parse(subscription) : null;
};

export const removeSubscription = (): void => {
  localStorage.removeItem('pushSubscription');
};

export const isPushSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const subscribeToPush = async (): Promise<PushSubscriptionJSON | null> => {
  if (!isPushSupported()) {
    console.log('Push notifications are not supported on this browser');
    return null;
  }
  
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted for notifications');
      return null;
    }
    
    // Get the subscription
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY || ''
    });
    
    // Convert to our consistent interface
    const subscriptionJSON: PushSubscriptionJSON = {
      endpoint: subscription.toJSON().endpoint || '',
      expirationTime: subscription.toJSON().expirationTime,
      keys: {
        p256dh: subscription.toJSON().keys?.p256dh || '',
        auth: subscription.toJSON().keys?.auth || ''
      }
    };
    
    saveSubscription(subscriptionJSON);
    return subscriptionJSON;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Define types for push subscriptions
export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

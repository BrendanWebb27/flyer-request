
/**
 * Utilities for managing push notifications
 */

// Store the subscription in local storage
export const saveSubscription = (subscription: PushSubscriptionJSON): void => {
  if (!subscription) return;
  localStorage.setItem('pushSubscription', JSON.stringify(subscription));
  
  // Update the last activity timestamp
  localStorage.setItem('lastUserActivity', Date.now().toString());
};

// Get the current subscription
export const getSubscription = (): PushSubscriptionJSON | null => {
  const subscription = localStorage.getItem('pushSubscription');
  return subscription ? JSON.parse(subscription) : null;
};

// Unsubscribe from notifications
export const removeSubscription = (): void => {
  localStorage.removeItem('pushSubscription');
};

// Check if push notifications are supported
export const isPushSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Subscribe to push notifications
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
      applicationServerKey: urlBase64ToUint8Array(process.env.VITE_VAPID_PUBLIC_KEY || '')
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
    
    // Register with Supabase
    await registerSubscriptionWithSupabase(subscriptionJSON);
    
    return subscriptionJSON;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Helper to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Register subscription with Supabase
async function registerSubscriptionWithSupabase(subscription: PushSubscriptionJSON): Promise<void> {
  try {
    // Call the Supabase Edge Function to register the subscription
    const response = await fetch('https://your-app-id.supabase.co/functions/v1/register-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include authentication if needed
        'Authorization': `Bearer ${localStorage.getItem('supabaseAccessToken')}`
      },
      body: JSON.stringify({
        subscription,
        userId: localStorage.getItem('userId'),
        // Include any user-specific data needed for notifications
        userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}')
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to register push subscription with Supabase');
    }
    
    console.log('Successfully registered push subscription');
  } catch (error) {
    console.error('Error registering push subscription:', error);
  }
}

// Define types for push subscriptions
export interface PushSubscriptionJSON {
  endpoint: string; // Making this required
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

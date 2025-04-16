
// Service Worker to handle push notifications

// Cache name for the app shell
const CACHE_NAME = 'flyer-request-cache-v1';

// Listen for install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  // Skip waiting to ensure the new service worker activates immediately
  self.skipWaiting();
});

// Listen for activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  // Claim clients so the service worker is in control immediately
  event.waitUntil(clients.claim());
});

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('Push notification received', event);

  if (!event.data) {
    console.log('No payload in the push notification');
    return;
  }

  try {
    // Parse the notification data
    const data = event.data.json();
    console.log('Push notification data:', data);

    // Default options for the notification
    const options = {
      body: data.body || 'New update from Flyer Request',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      tag: data.requestId || 'general',  // Group notifications by request ID
      renotify: true,  // Force notification even if same tag
      data: {
        url: data.url || '/',
        requestId: data.requestId
      },
      actions: []
    };
    
    // Add actions based on notification type
    if (data.title.includes('New Request')) {
      options.actions = [
        {
          action: 'view',
          title: 'View'
        },
        {
          action: 'accept',
          title: 'Accept'
        }
      ];
    } else if (data.title.includes('Request Accepted')) {
      options.actions = [
        {
          action: 'view',
          title: 'View'
        }
      ];
    }

    // Show the notification
    event.waitUntil(
      self.registration.showNotification(data.title || 'Flyer Request', options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Listen for notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked', event);
  
  // Close the notification
  event.notification.close();

  // Handle action clicks
  const action = event.action;
  const notification = event.notification;
  const requestId = notification.data?.requestId;
  let url = notification.data?.url || '/';
  
  // Modify URL based on the action
  if (action === 'accept' && requestId) {
    url = `/support?status=pending&requestId=${requestId}&action=accept`;
  }

  // Open or focus the app to the specific page
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          return client.navigate(url);
        }
      }

      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle fetch events (optional, for offline functionality)
self.addEventListener('fetch', (event) => {
  // For simple offline support, we could implement caching here
  // This is a basic implementation, you can expand this as needed
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

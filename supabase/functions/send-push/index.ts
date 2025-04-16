
// Follow this setup guide to integrate the Supabase client with Deno:
// https://supabase.com/docs/guides/functions/deno
//
// This is the Edge Function to send push notifications

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import * as webPush from "https://esm.sh/web-push@3.5.0";

// Get environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@yourapp.com';

// Set up web-push
webPush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      status: 204,
    });
  }

  try {
    // Get request body
    const { subscription, notification, userId } = await req.json();
    
    // Create authenticated Supabase client
    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: req.headers.get('Authorization') || '' } }
      }
    );
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Send the push notification
    try {
      const result = await webPush.sendNotification(
        subscription,
        JSON.stringify(notification)
      );
      
      // Record the notification in the database for tracking
      const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
      await adminSupabase
        .from('push_notifications')
        .insert({
          user_id: user.id,
          notification_type: 'request_update',
          request_id: notification.requestId,
          title: notification.title,
          body: notification.body,
          status: 'sent'
        });
      
      return new Response(
        JSON.stringify({ success: true, result }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (pushError) {
      console.error('Error sending push notification:', pushError);
      
      // If the subscription is no longer valid, remove it
      if (
        pushError.statusCode === 404 || 
        pushError.statusCode === 410 || 
        pushError.message?.includes('expired')
      ) {
        // Remove invalid subscription
        const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
        await adminSupabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to send notification', details: pushError }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

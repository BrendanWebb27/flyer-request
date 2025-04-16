
// Follow this setup guide to integrate the Supabase client with Deno:
// https://supabase.com/docs/guides/functions/deno
//
// This is the Edge Function to register push subscriptions

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// Get environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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
    const { subscription, userId, userProfile } = await req.json();
    
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
    
    // Use admin client to save subscription regardless of RLS
    const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    
    // Store subscription in database
    const { data, error } = await adminSupabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        expiration_time: subscription.expirationTime,
        profile_data: userProfile
      }, { onConflict: 'endpoint' })
      .select();
    
    if (error) {
      console.error('Error saving subscription:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save subscription' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

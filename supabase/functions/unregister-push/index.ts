
// Follow this setup guide to integrate the Supabase client with Deno:
// https://supabase.com/docs/guides/functions/deno
//
// This is the Edge Function to unregister push subscriptions

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
    const { endpoint } = await req.json();
    
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
    
    // Use admin client to delete subscription regardless of RLS
    const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    
    // Remove subscription from database
    const { error } = await adminSupabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error removing subscription:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to remove subscription' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
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

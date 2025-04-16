
-- Create tables for push notifications

-- Table to store push subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  keys JSONB NOT NULL,
  expiration_time BIGINT,
  profile_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Table to track notification history
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  request_id TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_notifications_user_id ON push_notifications(user_id);

-- Create RLS policies for push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" ON push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own subscriptions
CREATE POLICY "Users can delete their own subscriptions" ON push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for push_notifications
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON push_notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert notifications
CREATE POLICY "Only service role can insert notifications" ON push_notifications
  FOR INSERT WITH CHECK (false); -- This will be handled via service role in edge functions

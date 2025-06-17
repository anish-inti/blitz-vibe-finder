/*
  # User Authentication & Data Persistence Schema

  1. New Tables
    - `users` - Extended user profiles with preferences
    - `user_actions` - Track all user interactions (likes, saves, reviews)
    - `user_plans` - Save and share outing plans
    - `user_preferences` - Store user settings and filters

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Secure user action tracking

  3. Features
    - Complete user profile management
    - Action tracking for likes, saves, reviews
    - Plan saving and sharing
    - Preference persistence
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  location text DEFAULT 'Chennai',
  preferences jsonb DEFAULT '{}',
  stats jsonb DEFAULT '{"places_visited": 0, "places_saved": 0, "reviews_written": 0}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User actions table (likes, saves, reviews, etc.)
CREATE TABLE IF NOT EXISTS user_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  place_id text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('like', 'save', 'review', 'visit', 'share')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User plans table (saved outing plans)
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  place_ids text[] DEFAULT '{}',
  occasion text,
  timing timestamptz,
  locality integer DEFAULT 5,
  is_public boolean DEFAULT false,
  share_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- User actions policies
CREATE POLICY "Users can read own actions"
  ON user_actions
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own actions"
  ON user_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own actions"
  ON user_actions
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own actions"
  ON user_actions
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- User plans policies
CREATE POLICY "Users can read own plans"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read public plans"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert own plans"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own plans"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own plans"
  ON user_plans
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- User preferences policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_place_id ON user_actions(place_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_type ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_public ON user_plans(is_public);
CREATE INDEX IF NOT EXISTS idx_user_plans_share_token ON user_plans(share_token);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
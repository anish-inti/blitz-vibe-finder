/*
  # Create places and reviews system

  1. New Tables
    - `places`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `address` (text, not null)
      - `location` (point for coordinates)
      - `category` (text, not null)
      - `description` (text)
      - `tags` (text array)
      - `opening_hours` (jsonb)
      - `price_level` (integer, 1-4)
      - `images` (text array for image URLs)
      - `added_by` (uuid, references users)
      - `is_verified` (boolean, default false)
      - `average_rating` (decimal)
      - `review_count` (integer, default 0)
      - `like_count` (integer, default 0)
      - `save_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `place_id` (uuid, references places)
      - `user_id` (uuid, references users)
      - `rating` (integer, 1-5)
      - `title` (text)
      - `content` (text)
      - `images` (text array)
      - `helpful_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `review_votes`
      - `id` (uuid, primary key)
      - `review_id` (uuid, references reviews)
      - `user_id` (uuid, references users)
      - `vote_type` (text, 'helpful' or 'not_helpful')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
    - Users can add places and reviews
    - Public read access for places and reviews
    - Users can only edit their own content

  3. Functions
    - Auto-update place statistics when reviews are added/updated
    - Trigger functions for maintaining data consistency
*/

-- Create places table
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  location point,
  latitude decimal,
  longitude decimal,
  category text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  opening_hours jsonb DEFAULT '{}',
  price_level integer CHECK (price_level >= 1 AND price_level <= 4),
  images text[] DEFAULT '{}',
  added_by uuid REFERENCES users(id) ON DELETE SET NULL,
  is_verified boolean DEFAULT false,
  average_rating decimal DEFAULT 0,
  review_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  save_count integer DEFAULT 0,
  visit_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id uuid REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text NOT NULL,
  images text[] DEFAULT '{}',
  helpful_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(place_id, user_id) -- One review per user per place
);

-- Create review votes table
CREATE TABLE IF NOT EXISTS review_votes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id) -- One vote per user per review
);

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Places policies
CREATE POLICY "Anyone can read places"
  ON places
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can add places"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (added_by IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own places"
  ON places
  FOR UPDATE
  TO authenticated
  USING (added_by IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can add reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Review votes policies
CREATE POLICY "Authenticated users can vote on reviews"
  ON review_votes
  FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_location ON places USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_places_added_by ON places(added_by);
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places(average_rating);
CREATE INDEX IF NOT EXISTS idx_places_created_at ON places(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON review_votes(review_id);

-- Function to update place statistics
CREATE OR REPLACE FUNCTION update_place_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update place statistics when reviews change
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE places 
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE place_id = NEW.place_id
      ),
      review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE place_id = NEW.place_id
      ),
      updated_at = now()
    WHERE id = NEW.place_id;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE places 
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM reviews 
        WHERE place_id = OLD.place_id
      ),
      review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE place_id = OLD.place_id
      ),
      updated_at = now()
    WHERE id = OLD.place_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update review helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE reviews 
    SET helpful_count = (
      SELECT COUNT(*) 
      FROM review_votes 
      WHERE review_id = NEW.review_id AND vote_type = 'helpful'
    )
    WHERE id = NEW.review_id;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE reviews 
    SET helpful_count = (
      SELECT COUNT(*) 
      FROM review_votes 
      WHERE review_id = OLD.review_id AND vote_type = 'helpful'
    )
    WHERE id = OLD.review_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update user action counts on places
CREATE OR REPLACE FUNCTION update_place_action_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment count based on action type
    IF NEW.action_type = 'like' THEN
      UPDATE places SET like_count = like_count + 1 WHERE id = NEW.place_id::uuid;
    ELSIF NEW.action_type = 'save' THEN
      UPDATE places SET save_count = save_count + 1 WHERE id = NEW.place_id::uuid;
    ELSIF NEW.action_type = 'visit' THEN
      UPDATE places SET visit_count = visit_count + 1 WHERE id = NEW.place_id::uuid;
    ELSIF NEW.action_type = 'share' THEN
      UPDATE places SET share_count = share_count + 1 WHERE id = NEW.place_id::uuid;
    END IF;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    -- Decrement count based on action type
    IF OLD.action_type = 'like' THEN
      UPDATE places SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.place_id::uuid;
    ELSIF OLD.action_type = 'save' THEN
      UPDATE places SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.place_id::uuid;
    ELSIF OLD.action_type = 'visit' THEN
      UPDATE places SET visit_count = GREATEST(visit_count - 1, 0) WHERE id = OLD.place_id::uuid;
    ELSIF OLD.action_type = 'share' THEN
      UPDATE places SET share_count = GREATEST(share_count - 1, 0) WHERE id = OLD.place_id::uuid;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_place_stats
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_place_stats();

CREATE TRIGGER trigger_update_review_helpful_count
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

CREATE TRIGGER trigger_update_place_action_counts
  AFTER INSERT OR DELETE ON user_actions
  FOR EACH ROW EXECUTE FUNCTION update_place_action_counts();

-- Triggers for updated_at
CREATE TRIGGER update_places_updated_at BEFORE UPDATE ON places
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
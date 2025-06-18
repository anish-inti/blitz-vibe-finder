/*
  # Places Table Schema Update

  1. Changes
    - Ensure places table exists with all required columns
    - Add check constraints for data integrity
    - Create indexes for better query performance
    - Set up Row Level Security policies
    - Add sample data if table is empty
*/

-- Create places table if it doesn't exist
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL DEFAULT '',
  location point,
  latitude numeric,
  longitude numeric,
  category text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  opening_hours jsonb DEFAULT '{}',
  price_level integer CHECK (price_level >= 1 AND price_level <= 4),
  images text[] DEFAULT '{}',
  added_by uuid,
  is_verified boolean DEFAULT false,
  average_rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  save_count integer DEFAULT 0,
  visit_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns to places table
DO $$
BEGIN
  -- Add average_rating column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE places ADD COLUMN average_rating numeric DEFAULT 0;
  END IF;

  -- Add review_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE places ADD COLUMN review_count integer DEFAULT 0;
  END IF;

  -- Add like_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'like_count'
  ) THEN
    ALTER TABLE places ADD COLUMN like_count integer DEFAULT 0;
  END IF;

  -- Add save_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE places ADD COLUMN save_count integer DEFAULT 0;
  END IF;

  -- Add visit_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'visit_count'
  ) THEN
    ALTER TABLE places ADD COLUMN visit_count integer DEFAULT 0;
  END IF;

  -- Add share_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE places ADD COLUMN share_count integer DEFAULT 0;
  END IF;
END $$;

-- Add check constraints to ensure data integrity
DO $$
BEGIN
  -- Add constraint for average_rating if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_average_rating_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_average_rating_check 
    CHECK (average_rating >= 0 AND average_rating <= 5);
  END IF;

  -- Add constraint for review_count if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_review_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_review_count_check 
    CHECK (review_count >= 0);
  END IF;

  -- Add constraint for like_count if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_like_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_like_count_check 
    CHECK (like_count >= 0);
  END IF;

  -- Add constraint for save_count if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_save_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_save_count_check 
    CHECK (save_count >= 0);
  END IF;

  -- Add constraint for visit_count if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_visit_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_visit_count_check 
    CHECK (visit_count >= 0);
  END IF;

  -- Add constraint for share_count if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_share_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_share_count_check 
    CHECK (share_count >= 0);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places (average_rating);
CREATE INDEX IF NOT EXISTS idx_places_review_count ON places (review_count);
CREATE INDEX IF NOT EXISTS idx_places_like_count ON places (like_count);
CREATE INDEX IF NOT EXISTS idx_places_save_count ON places (save_count);
CREATE INDEX IF NOT EXISTS idx_places_visit_count ON places (visit_count);
CREATE INDEX IF NOT EXISTS idx_places_share_count ON places (share_count);

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can read places" ON places;
DROP POLICY IF EXISTS "Authenticated users can add places" ON places;
DROP POLICY IF EXISTS "Users can update own places" ON places;

-- Create RLS policies (without IF NOT EXISTS which is not supported for policies)
CREATE POLICY "Anyone can read places"
  ON places
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can add places"
  ON places
  FOR INSERT
  TO authenticated
  WITH CHECK (
    added_by IN (
      SELECT users.id
      FROM users
      WHERE users.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own places"
  ON places
  FOR UPDATE
  TO authenticated
  USING (
    added_by IN (
      SELECT users.id
      FROM users
      WHERE users.auth_user_id = auth.uid()
    )
  );

-- Insert sample data if the table is empty
INSERT INTO places (name, address, category, description, tags, images, average_rating, review_count, like_count, save_count, visit_count, share_count, is_verified, price_level)
SELECT 
  'Marina Beach', 
  'Marina Beach Rd, Chennai', 
  'Beach', 
  'Famous beach in Chennai perfect for evening walks', 
  ARRAY['Outdoor', 'Scenic', 'Family-friendly'], 
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'], 
  4.2, 
  1250, 
  350, 
  180, 
  420, 
  95, 
  true, 
  1
WHERE NOT EXISTS (SELECT 1 FROM places LIMIT 1);

INSERT INTO places (name, address, category, description, tags, images, average_rating, review_count, like_count, save_count, visit_count, share_count, is_verified, price_level)
SELECT 
  'Phoenix MarketCity', 
  'Velachery, Chennai', 
  'Shopping Mall', 
  'Popular shopping and entertainment destination', 
  ARRAY['Shopping', 'Entertainment', 'Food'], 
  ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'], 
  4.4, 
  890, 
  210, 
  150, 
  380, 
  75, 
  true, 
  3
WHERE NOT EXISTS (SELECT 1 FROM places LIMIT 1);

INSERT INTO places (name, address, category, description, tags, images, average_rating, review_count, like_count, save_count, visit_count, share_count, is_verified, price_level)
SELECT 
  'Kapaleeshwarar Temple', 
  'Mylapore, Chennai', 
  'Temple', 
  'Historic temple with beautiful architecture', 
  ARRAY['Historic', 'Cultural', 'Spiritual'], 
  ARRAY['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop'], 
  4.6, 
  2100, 
  420, 
  280, 
  560, 
  130, 
  true, 
  1
WHERE NOT EXISTS (SELECT 1 FROM places LIMIT 1);
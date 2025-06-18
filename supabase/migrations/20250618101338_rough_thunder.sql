/*
  # Add missing columns to places table

  1. Schema Updates
    - Add `address` column for place addresses
    - Add `latitude` and `longitude` for coordinates
    - Add `description` for place descriptions
    - Add `tags` array for categorization
    - Add `opening_hours` JSONB for business hours
    - Add `price_level` for pricing information
    - Add `images` array for place photos
    - Add `added_by` to track who added the place
    - Add `is_verified` for verification status
    - Add `average_rating` for rating calculations
    - Add `review_count` for review statistics
    - Add `like_count` for like statistics
    - Add `save_count` for save statistics
    - Add `visit_count` for visit statistics
    - Add `share_count` for share statistics
    - Add `metadata` JSONB for additional data
    - Add `updated_at` timestamp

  2. Security
    - Maintain existing RLS policies
    - Add foreign key constraint for added_by
*/

-- Add missing columns to places table
DO $$
BEGIN
  -- Add address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'address'
  ) THEN
    ALTER TABLE places ADD COLUMN address TEXT NOT NULL DEFAULT '';
  END IF;

  -- Add latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE places ADD COLUMN latitude NUMERIC;
  END IF;

  -- Add longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE places ADD COLUMN longitude NUMERIC;
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'description'
  ) THEN
    ALTER TABLE places ADD COLUMN description TEXT;
  END IF;

  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'tags'
  ) THEN
    ALTER TABLE places ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;

  -- Add opening_hours column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'opening_hours'
  ) THEN
    ALTER TABLE places ADD COLUMN opening_hours JSONB DEFAULT '{}';
  END IF;

  -- Add price_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'price_level'
  ) THEN
    ALTER TABLE places ADD COLUMN price_level INTEGER;
  END IF;

  -- Add images column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'images'
  ) THEN
    ALTER TABLE places ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;

  -- Add added_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'added_by'
  ) THEN
    ALTER TABLE places ADD COLUMN added_by UUID;
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE places ADD COLUMN is_verified BOOLEAN DEFAULT false;
  END IF;

  -- Add average_rating column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE places ADD COLUMN average_rating NUMERIC DEFAULT 0;
  END IF;

  -- Add review_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE places ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;

  -- Add like_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'like_count'
  ) THEN
    ALTER TABLE places ADD COLUMN like_count INTEGER DEFAULT 0;
  END IF;

  -- Add save_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE places ADD COLUMN save_count INTEGER DEFAULT 0;
  END IF;

  -- Add visit_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'visit_count'
  ) THEN
    ALTER TABLE places ADD COLUMN visit_count INTEGER DEFAULT 0;
  END IF;

  -- Add share_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE places ADD COLUMN share_count INTEGER DEFAULT 0;
  END IF;

  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE places ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE places ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Add foreign key constraint for added_by if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'places_added_by_fkey'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_added_by_fkey 
    FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add check constraint for price_level if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'places_price_level_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_price_level_check 
    CHECK (price_level >= 1 AND price_level <= 4);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_places_added_by ON places(added_by);
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places(average_rating);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_created_at ON places(created_at);

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'update_places_updated_at'
  ) THEN
    CREATE TRIGGER update_places_updated_at
      BEFORE UPDATE ON places
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Update existing RLS policies to work with new structure
DROP POLICY IF EXISTS "Anyone can read places" ON places;
DROP POLICY IF EXISTS "Authenticated users can add places" ON places;
DROP POLICY IF EXISTS "Users can update own places" ON places;

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
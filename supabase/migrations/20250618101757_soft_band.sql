/*
  # Fix missing columns in places table

  1. Schema Updates
    - Ensure all required columns exist in places table
    - Add missing columns: average_rating, like_count, save_count, visit_count, share_count
    - Add proper constraints and defaults
    - Update indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure proper foreign key constraints
*/

-- Ensure places table exists with all required columns
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

-- Add missing columns if they don't exist
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

  -- Add address column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'address'
  ) THEN
    ALTER TABLE places ADD COLUMN address text NOT NULL DEFAULT '';
  END IF;

  -- Add latitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE places ADD COLUMN latitude numeric;
  END IF;

  -- Add longitude column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE places ADD COLUMN longitude numeric;
  END IF;

  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'description'
  ) THEN
    ALTER TABLE places ADD COLUMN description text;
  END IF;

  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'tags'
  ) THEN
    ALTER TABLE places ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add opening_hours column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'opening_hours'
  ) THEN
    ALTER TABLE places ADD COLUMN opening_hours jsonb DEFAULT '{}';
  END IF;

  -- Add price_level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'price_level'
  ) THEN
    ALTER TABLE places ADD COLUMN price_level integer;
  END IF;

  -- Add images column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'images'
  ) THEN
    ALTER TABLE places ADD COLUMN images text[] DEFAULT '{}';
  END IF;

  -- Add added_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'added_by'
  ) THEN
    ALTER TABLE places ADD COLUMN added_by uuid;
  END IF;

  -- Add is_verified column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE places ADD COLUMN is_verified boolean DEFAULT false;
  END IF;

  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE places ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE places ADD COLUMN updated_at timestamptz DEFAULT now();
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

-- Enable Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can read places" ON places;
DROP POLICY IF EXISTS "Authenticated users can add places" ON places;
DROP POLICY IF EXISTS "Users can update own places" ON places;

-- Create RLS policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_location ON places USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_places_added_by ON places(added_by);
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places(average_rating);
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

-- Ensure trigger functions exist
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

-- Create triggers if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'trigger_update_place_action_counts'
  ) THEN
    CREATE TRIGGER trigger_update_place_action_counts
      AFTER INSERT OR DELETE ON user_actions
      FOR EACH ROW EXECUTE FUNCTION update_place_action_counts();
  END IF;
END $$;
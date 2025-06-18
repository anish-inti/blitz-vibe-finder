/*
  # Add missing aggregate columns to places table

  1. New Columns (if missing)
    - `average_rating` (numeric) - Average rating from reviews
    - `review_count` (integer) - Total number of reviews
    - `like_count` (integer) - Total number of likes
    - `save_count` (integer) - Total number of saves
    - `visit_count` (integer) - Total number of visits
    - `share_count` (integer) - Total number of shares

  2. Constraints
    - Add check constraints for valid ranges
    - Set appropriate default values

  3. Indexes
    - Add indexes for performance on aggregate columns
*/

-- Add columns if they don't exist
DO $$
BEGIN
  -- Add average_rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE places ADD COLUMN average_rating numeric DEFAULT 0;
  END IF;

  -- Add review_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE places ADD COLUMN review_count integer DEFAULT 0;
  END IF;

  -- Add like_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'like_count'
  ) THEN
    ALTER TABLE places ADD COLUMN like_count integer DEFAULT 0;
  END IF;

  -- Add save_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE places ADD COLUMN save_count integer DEFAULT 0;
  END IF;

  -- Add visit_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'visit_count'
  ) THEN
    ALTER TABLE places ADD COLUMN visit_count integer DEFAULT 0;
  END IF;

  -- Add share_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE places ADD COLUMN share_count integer DEFAULT 0;
  END IF;
END $$;

-- Add constraints if they don't exist
DO $$
BEGIN
  -- Average rating constraint (0-5)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'places_average_rating_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_average_rating_check 
    CHECK (average_rating >= 0 AND average_rating <= 5);
  END IF;

  -- Review count constraint (non-negative)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'places_review_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_review_count_check 
    CHECK (review_count >= 0);
  END IF;

  -- Like count constraint (non-negative)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'places_like_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_like_count_check 
    CHECK (like_count >= 0);
  END IF;

  -- Save count constraint (non-negative)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'places_save_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_save_count_check 
    CHECK (save_count >= 0);
  END IF;

  -- Visit count constraint (non-negative)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'places_visit_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_visit_count_check 
    CHECK (visit_count >= 0);
  END IF;

  -- Share count constraint (non-negative)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'places_share_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_share_count_check 
    CHECK (share_count >= 0);
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places (average_rating);
CREATE INDEX IF NOT EXISTS idx_places_review_count ON places (review_count);
CREATE INDEX IF NOT EXISTS idx_places_like_count ON places (like_count);
CREATE INDEX IF NOT EXISTS idx_places_save_count ON places (save_count);
CREATE INDEX IF NOT EXISTS idx_places_visit_count ON places (visit_count);
CREATE INDEX IF NOT EXISTS idx_places_share_count ON places (share_count);

-- Update existing places to have default values
UPDATE places 
SET 
  average_rating = COALESCE(average_rating, 0),
  review_count = COALESCE(review_count, 0),
  like_count = COALESCE(like_count, 0),
  save_count = COALESCE(save_count, 0),
  visit_count = COALESCE(visit_count, 0),
  share_count = COALESCE(share_count, 0)
WHERE 
  average_rating IS NULL OR
  review_count IS NULL OR
  like_count IS NULL OR
  save_count IS NULL OR
  visit_count IS NULL OR
  share_count IS NULL;
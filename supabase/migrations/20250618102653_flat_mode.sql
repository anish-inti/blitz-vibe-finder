/*
  # Add missing columns to places table

  1. Missing Columns Added
    - `average_rating` (numeric, default 0) - stores the calculated average rating from reviews
    - `review_count` (integer, default 0) - tracks total number of reviews
    - `like_count` (integer, default 0) - tracks number of likes/favorites
    - `save_count` (integer, default 0) - tracks how many times place was saved
    - `visit_count` (integer, default 0) - tracks visit interactions
    - `share_count` (integer, default 0) - tracks share interactions

  2. Constraints Added
    - Check constraints to ensure counts are non-negative
    - Check constraint for average_rating to be between 0 and 5

  3. Indexes Added
    - Performance indexes for sorting and filtering operations

  This migration ensures the places table matches the expected schema for all application features.
*/

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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places (average_rating);
CREATE INDEX IF NOT EXISTS idx_places_review_count ON places (review_count);
CREATE INDEX IF NOT EXISTS idx_places_like_count ON places (like_count);
CREATE INDEX IF NOT EXISTS idx_places_save_count ON places (save_count);
CREATE INDEX IF NOT EXISTS idx_places_visit_count ON places (visit_count);
CREATE INDEX IF NOT EXISTS idx_places_share_count ON places (share_count);
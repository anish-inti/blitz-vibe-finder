/*
  # Add missing columns to places table

  1. New Columns
    - `average_rating` (numeric, default 0) - Average rating from reviews
    - `review_count` (integer, default 0) - Number of reviews
    - `like_count` (integer, default 0) - Number of likes
    - `save_count` (integer, default 0) - Number of saves
    - `visit_count` (integer, default 0) - Number of visits
    - `share_count` (integer, default 0) - Number of shares

  2. Indexes
    - Add indexes for performance on rating and count columns

  3. Notes
    - These columns are used for sorting and filtering places
    - Default values ensure no null values
    - Indexes improve query performance for trending/popular places
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

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places (average_rating);
CREATE INDEX IF NOT EXISTS idx_places_review_count ON places (review_count);
CREATE INDEX IF NOT EXISTS idx_places_like_count ON places (like_count);
CREATE INDEX IF NOT EXISTS idx_places_save_count ON places (save_count);
CREATE INDEX IF NOT EXISTS idx_places_visit_count ON places (visit_count);
CREATE INDEX IF NOT EXISTS idx_places_share_count ON places (share_count);
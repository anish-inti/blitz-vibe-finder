/*
  # Add missing statistics columns to places table

  1. New Columns
    - `average_rating` (numeric, default 0) - Average rating from reviews
    - `review_count` (integer, default 0) - Total number of reviews
    - `like_count` (integer, default 0) - Number of likes from user actions
    - `save_count` (integer, default 0) - Number of saves from user actions
    - `visit_count` (integer, default 0) - Number of visits from user actions
    - `share_count` (integer, default 0) - Number of shares from user actions

  2. Indexes
    - Add index on average_rating for performance

  3. Notes
    - All columns have default values to ensure data consistency
    - These columns will be automatically updated by triggers when user actions or reviews are added
*/

-- Add missing statistics columns to places table
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

-- Create index on average_rating for better query performance
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places (average_rating);
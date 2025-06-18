/*
  # Fix missing columns in places table

  1. Missing Columns
    - Ensure `average_rating` column exists with proper type and default
    - Ensure `like_count` column exists with proper type and default
    - Ensure all other expected columns exist with proper defaults

  2. Data Integrity
    - Add proper constraints for rating values
    - Set appropriate default values for counts
    - Ensure no data loss during column additions

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for sorting and filtering operations
*/

-- Ensure average_rating column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE places ADD COLUMN average_rating numeric DEFAULT 0;
  END IF;
END $$;

-- Ensure like_count column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'like_count'
  ) THEN
    ALTER TABLE places ADD COLUMN like_count integer DEFAULT 0;
  END IF;
END $$;

-- Ensure save_count column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE places ADD COLUMN save_count integer DEFAULT 0;
  END IF;
END $$;

-- Ensure visit_count column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'visit_count'
  ) THEN
    ALTER TABLE places ADD COLUMN visit_count integer DEFAULT 0;
  END IF;
END $$;

-- Ensure share_count column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE places ADD COLUMN share_count integer DEFAULT 0;
  END IF;
END $$;

-- Ensure review_count column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE places ADD COLUMN review_count integer DEFAULT 0;
  END IF;
END $$;

-- Add constraints for rating values (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_average_rating_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_average_rating_check 
    CHECK (average_rating >= 0 AND average_rating <= 5);
  END IF;
END $$;

-- Add constraints for count values (ensure they're not negative)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_like_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_like_count_check 
    CHECK (like_count >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_save_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_save_count_check 
    CHECK (save_count >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_visit_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_visit_count_check 
    CHECK (visit_count >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_share_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_share_count_check 
    CHECK (share_count >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'places' AND constraint_name = 'places_review_count_check'
  ) THEN
    ALTER TABLE places ADD CONSTRAINT places_review_count_check 
    CHECK (review_count >= 0);
  END IF;
END $$;

-- Create indexes for performance (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'places' AND indexname = 'idx_places_average_rating'
  ) THEN
    CREATE INDEX idx_places_average_rating ON places (average_rating);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'places' AND indexname = 'idx_places_like_count'
  ) THEN
    CREATE INDEX idx_places_like_count ON places (like_count);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'places' AND indexname = 'idx_places_save_count'
  ) THEN
    CREATE INDEX idx_places_save_count ON places (save_count);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'places' AND indexname = 'idx_places_visit_count'
  ) THEN
    CREATE INDEX idx_places_visit_count ON places (visit_count);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'places' AND indexname = 'idx_places_share_count'
  ) THEN
    CREATE INDEX idx_places_share_count ON places (share_count);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'places' AND indexname = 'idx_places_review_count'
  ) THEN
    CREATE INDEX idx_places_review_count ON places (review_count);
  END IF;
END $$;
-- Add missing columns to places table if they don't exist
DO $$
BEGIN
  -- Add like_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'like_count'
  ) THEN
    ALTER TABLE places ADD COLUMN like_count integer DEFAULT 0;
    ALTER TABLE places ADD CONSTRAINT places_like_count_check CHECK (like_count >= 0);
  END IF;

  -- Add save_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'save_count'
  ) THEN
    ALTER TABLE places ADD COLUMN save_count integer DEFAULT 0;
    ALTER TABLE places ADD CONSTRAINT places_save_count_check CHECK (save_count >= 0);
  END IF;

  -- Add visit_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'visit_count'
  ) THEN
    ALTER TABLE places ADD COLUMN visit_count integer DEFAULT 0;
    ALTER TABLE places ADD CONSTRAINT places_visit_count_check CHECK (visit_count >= 0);
  END IF;

  -- Add share_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE places ADD COLUMN share_count integer DEFAULT 0;
    ALTER TABLE places ADD CONSTRAINT places_share_count_check CHECK (share_count >= 0);
  END IF;

  -- Add average_rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE places ADD COLUMN average_rating numeric DEFAULT 0;
    ALTER TABLE places ADD CONSTRAINT places_average_rating_check CHECK (average_rating >= 0 AND average_rating <= 5);
  END IF;

  -- Add review_count column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'places' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE places ADD COLUMN review_count integer DEFAULT 0;
    ALTER TABLE places ADD CONSTRAINT places_review_count_check CHECK (review_count >= 0);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_places_like_count ON places (like_count);
CREATE INDEX IF NOT EXISTS idx_places_save_count ON places (save_count);
CREATE INDEX IF NOT EXISTS idx_places_visit_count ON places (visit_count);
CREATE INDEX IF NOT EXISTS idx_places_share_count ON places (share_count);
CREATE INDEX IF NOT EXISTS idx_places_average_rating ON places (average_rating);
CREATE INDEX IF NOT EXISTS idx_places_review_count ON places (review_count);
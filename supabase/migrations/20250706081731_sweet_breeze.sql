/*
  # Add Superhost Column to Properties

  1. Schema Changes
    - Add `is_superhost` boolean column to `properties` table
    - Set default value to false
    - Update existing records to have default value

  2. No breaking changes
    - Column is nullable and has a default value
    - Existing functionality remains intact
*/

-- Add is_superhost column to properties table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'is_superhost'
  ) THEN
    ALTER TABLE properties ADD COLUMN is_superhost boolean DEFAULT false;
  END IF;
END $$;

-- Update existing records to have default value
UPDATE properties SET is_superhost = false WHERE is_superhost IS NULL;
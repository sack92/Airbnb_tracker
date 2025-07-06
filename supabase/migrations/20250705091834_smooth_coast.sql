/*
  # Create Airbnb Tracker Database Schema

  1. New Tables
    - `areas`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `properties`
      - `id` (uuid, primary key)
      - `area_id` (uuid, foreign key)
      - `name` (text)
      - `airbnb_link` (text)
      - `avg_price_per_day` (numeric)
      - `description` (text)
      - `bedrooms` (integer)
      - `property_type` (text, check constraint)
      - `created_at` (timestamp)
    - `bookings`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key)
      - `date` (date)
      - `status` (text, check constraint)
      - `price` (numeric)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (simple auth system)

  3. Performance
    - Add indexes for frequently queried columns
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop areas policies
  DROP POLICY IF EXISTS "Areas are viewable by everyone" ON areas;
  DROP POLICY IF EXISTS "Areas are insertable by everyone" ON areas;
  DROP POLICY IF EXISTS "Areas are updatable by everyone" ON areas;
  DROP POLICY IF EXISTS "Areas are deletable by everyone" ON areas;
  
  -- Drop properties policies
  DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
  DROP POLICY IF EXISTS "Properties are insertable by everyone" ON properties;
  DROP POLICY IF EXISTS "Properties are updatable by everyone" ON properties;
  DROP POLICY IF EXISTS "Properties are deletable by everyone" ON properties;
  
  -- Drop bookings policies
  DROP POLICY IF EXISTS "Bookings are viewable by everyone" ON bookings;
  DROP POLICY IF EXISTS "Bookings are insertable by everyone" ON bookings;
  DROP POLICY IF EXISTS "Bookings are updatable by everyone" ON bookings;
  DROP POLICY IF EXISTS "Bookings are deletable by everyone" ON bookings;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Ignore if policies don't exist
END $$;

-- Create areas table
CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
  name text NOT NULL,
  airbnb_link text DEFAULT '',
  avg_price_per_day numeric DEFAULT 0,
  description text DEFAULT '',
  bedrooms integer DEFAULT 1,
  property_type text DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT properties_property_type_check CHECK (property_type = ANY (ARRAY['normal'::text, 'luxury'::text]))
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text DEFAULT 'available',
  price numeric DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT bookings_property_id_date_key UNIQUE (property_id, date),
  CONSTRAINT bookings_status_check CHECK (status = ANY (ARRAY['available'::text, 'blocked'::text, 'booked'::text]))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_area_id ON properties(area_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're using simple auth)
CREATE POLICY "Areas are viewable by everyone" ON areas FOR SELECT USING (true);
CREATE POLICY "Areas are insertable by everyone" ON areas FOR INSERT WITH CHECK (true);
CREATE POLICY "Areas are updatable by everyone" ON areas FOR UPDATE USING (true);
CREATE POLICY "Areas are deletable by everyone" ON areas FOR DELETE USING (true);

CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Properties are insertable by everyone" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Properties are updatable by everyone" ON properties FOR UPDATE USING (true);
CREATE POLICY "Properties are deletable by everyone" ON properties FOR DELETE USING (true);

CREATE POLICY "Bookings are viewable by everyone" ON bookings FOR SELECT USING (true);
CREATE POLICY "Bookings are insertable by everyone" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Bookings are updatable by everyone" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Bookings are deletable by everyone" ON bookings FOR DELETE USING (true);
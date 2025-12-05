-- WV Runs Database Setup
-- Run this entire file in your Supabase SQL Editor

-- ============================================
-- CREATE TABLES
-- ============================================

-- 1. Schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Meets table
CREATE TABLE IF NOT EXISTS meets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Athletes table
CREATE TABLE IF NOT EXISTS athletes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_slug TEXT REFERENCES schools(slug) ON DELETE SET NULL,
  name TEXT NOT NULL,
  grade INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Results table
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meet_slug TEXT REFERENCES meets(slug) ON DELETE SET NULL,
  school_slug TEXT REFERENCES schools(slug) ON DELETE SET NULL,
  athlete_name TEXT NOT NULL,
  time DECIMAL(10, 2),
  distance DECIMAL(5, 2),
  place INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert sample schools
INSERT INTO schools (name, slug) VALUES
  ('Morgantown High', 'morgantown'),
  ('University High', 'university-high'),
  ('Bridgeport High', 'bridgeport'),
  ('Parkersburg High', 'parkersburg')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- OPTION 1: DISABLE RLS (EASIEST FOR DEVELOPMENT)
-- Uncomment the following lines if you want to disable RLS:
/*
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE meets DISABLE ROW LEVEL SECURITY;
ALTER TABLE athletes DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
*/

-- OPTION 2: ENABLE FULL CRUD ACCESS (RECOMMENDED FOR PRODUCTION)
-- Uncomment the following lines to enable RLS with full access:

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE meets ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Schools policies
CREATE POLICY "Allow anonymous select on schools"
  ON schools FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert on schools"
  ON schools FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on schools"
  ON schools FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous delete on schools"
  ON schools FOR DELETE TO anon USING (true);

-- Meets policies
CREATE POLICY "Allow anonymous select on meets"
  ON meets FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert on meets"
  ON meets FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on meets"
  ON meets FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous delete on meets"
  ON meets FOR DELETE TO anon USING (true);

-- Athletes policies
CREATE POLICY "Allow anonymous select on athletes"
  ON athletes FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert on athletes"
  ON athletes FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on athletes"
  ON athletes FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous delete on athletes"
  ON athletes FOR DELETE TO anon USING (true);

-- Results policies
CREATE POLICY "Allow anonymous select on results"
  ON results FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert on results"
  ON results FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on results"
  ON results FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous delete on results"
  ON results FOR DELETE TO anon USING (true);

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Test by selecting from tables
SELECT * FROM schools;
SELECT * FROM meets;
SELECT * FROM athletes;
SELECT * FROM results;


# Supabase Setup Guide

This guide will help you set up your Supabase database tables for the WV Runs project.

## Prerequisites

Your Supabase project is already configured at:
- **URL**: https://oxdqbytfrjugvcojydzw.supabase.co
- **API Key**: Configured in `supabase-config.js`

## Required Tables

### 1. schools

Stores information about schools/teams.

```sql
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample Data:**
```sql
INSERT INTO schools (name, slug) VALUES
  ('Morgantown High', 'morgantown'),
  ('University High', 'university-high'),
  ('Bridgeport High', 'bridgeport'),
  ('Parkersburg High', 'parkersburg');
```

### 2. meets

Stores information about meets/races.

```sql
CREATE TABLE meets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. athletes

Stores athlete information.

```sql
CREATE TABLE athletes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_slug TEXT REFERENCES schools(slug),
  name TEXT NOT NULL,
  grade INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. results

Stores race results.

```sql
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meet_slug TEXT REFERENCES meets(slug),
  school_slug TEXT REFERENCES schools(slug),
  athlete_name TEXT NOT NULL,
  time DECIMAL(10, 2),
  distance DECIMAL(5, 2),
  place INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setting Up Tables in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor**
4. Run each CREATE TABLE statement above
5. Insert sample data as needed

## Row Level Security (RLS)

Since your admin page uses the anonymous key for operations, you have two options:

### Option 1: Disable RLS (Easiest - For Development Only)

**⚠️ WARNING: This allows full access to anyone with your anonymous key. Only use this for development/testing.**

```sql
-- Disable RLS on all tables (easier for admin operations)
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE meets DISABLE ROW LEVEL SECURITY;
ALTER TABLE athletes DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

### Option 2: Enable Full CRUD Access (Recommended for Production)

If you want to keep RLS enabled, you need to create policies for all operations:

```sql
-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE meets ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Schools policies (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow anonymous select on schools"
  ON schools FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anonymous insert on schools"
  ON schools FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on schools"
  ON schools FOR UPDATE
  TO anon USING (true);

CREATE POLICY "Allow anonymous delete on schools"
  ON schools FOR DELETE
  TO anon USING (true);

-- Meets policies
CREATE POLICY "Allow anonymous select on meets"
  ON meets FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anonymous insert on meets"
  ON meets FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on meets"
  ON meets FOR UPDATE
  TO anon USING (true);

CREATE POLICY "Allow anonymous delete on meets"
  ON meets FOR DELETE
  TO anon USING (true);

-- Athletes policies
CREATE POLICY "Allow anonymous select on athletes"
  ON athletes FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anonymous insert on athletes"
  ON athletes FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on athletes"
  ON athletes FOR UPDATE
  TO anon USING (true);

CREATE POLICY "Allow anonymous delete on athletes"
  ON athletes FOR DELETE
  TO anon USING (true);

-- Results policies
CREATE POLICY "Allow anonymous select on results"
  ON results FOR SELECT
  TO anon USING (true);

CREATE POLICY "Allow anonymous insert on results"
  ON results FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on results"
  ON results FOR UPDATE
  TO anon USING (true);

CREATE POLICY "Allow anonymous delete on results"
  ON results FOR DELETE
  TO anon USING (true);
```

## Usage

The Supabase client is now available in your HTML pages. You can use it in two ways:

### Method 1: Direct Supabase Client

```javascript
// Fetch schools
const { data, error } = await supabase
  .from('schools')
  .select('*')
  .order('name');
```

### Method 2: Helper Functions

Include `supabase-helpers.js` in your HTML:

```html
<script src="supabase-helpers.js"></script>
```

Then use the helper functions:

```javascript
// Get all schools
const schools = await getAllSchools();

// Get a specific school
const school = await getSchoolBySlug('parkersburg');

// Get all meets
const meets = await getAllMeets(10);
```

## Files Created

- `supabase-config.js` - Supabase client configuration
- `supabase-helpers.js` - Helper functions for common database operations
- Updated `home.html`, `schools.html`, `schools/parkersburg.html` - Added Supabase scripts
- Updated `script.js` - Example Supabase integration with fallback to JSON

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)


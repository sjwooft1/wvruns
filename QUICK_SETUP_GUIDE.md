# Quick Setup Guide for Supabase Tables

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard
Visit: https://app.supabase.com and login

### 2. Select Your Project
Click on the project: `oxdqbytfrjugvcojydzw`

### 3. Open SQL Editor
- Click on **"SQL Editor"** in the left sidebar
- Click **"New query"** button

### 4. Copy & Paste the SQL Below

Copy the ENTIRE block below and paste it into the SQL Editor:

```sql
-- ============================================
-- CREATE ALL TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS athletes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_slug TEXT REFERENCES schools(slug) ON DELETE SET NULL,
  name TEXT NOT NULL,
  grade INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

INSERT INTO schools (name, slug) VALUES
  ('Morgantown High', 'morgantown'),
  ('University High', 'university-high'),
  ('Bridgeport High', 'bridgeport'),
  ('Parkersburg High', 'parkersburg')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DISABLE RLS (FOR EASY DEVELOPMENT)
-- ============================================

ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE meets DISABLE ROW LEVEL SECURITY;
ALTER TABLE athletes DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

### 5. Run the Query
- Click the **"Run"** button (or press Cmd+Enter / Ctrl+Enter)
- You should see: "Success. No rows returned"

### 6. Verify Tables Were Created
- Go to **"Table Editor"** in the left sidebar
- You should see 4 tables: `schools`, `meets`, `athletes`, `results`
- Click on `schools` to see the 4 sample schools

### 7. Test the Admin Page
- Open `admin.html` in your browser
- You should be able to add, edit, and delete data!

## Troubleshooting

**Error: "relation does not exist"**
- Make sure you ran ALL the CREATE TABLE statements
- Try running them one at a time if needed

**Error: "permission denied"**
- Make sure you disabled RLS (last 4 lines of the SQL)

**Tables not showing up**
- Refresh the page
- Go to Table Editor and click the refresh icon

**Can't add data in admin**
- Check browser console for errors
- Make sure the Supabase URL and key are correct in `supabase-config.js`

## Need Help?
Check the full guide in `SUPABASE_SETUP.md`


# Dynamic School Pages System

## How It Works

Instead of creating individual HTML files for each school, there is now a single dynamic page (`school.html`) that loads school data based on the URL parameter.

## Adding a New School

When you add a new school to Supabase, it will automatically appear on the site! Here's how:

### 1. Add School to Supabase

Using the **Admin Page** (`admin.html`):
- Go to the "Schools" tab
- Fill in the school name and slug
- Click "Add School"

**OR** using SQL in Supabase:
```sql
INSERT INTO schools (name, slug) VALUES
  ('Your School Name', 'your-school-slug');
```

### 2. Logo (Optional)

Place a logo file in `assets/team logos/`:
- Filename should match the school slug
- Example: If slug is `your-school-slug`, file should be `your-school-slug.png`
- If no logo exists, the page will still work but won't show a logo

### 3. Done!

The school will automatically:
- Appear on the Schools page (`schools.html`)
- Have its own page at `school.html?school=your-school-slug`
- Be clickable and fully functional

## Adding Athletes to a School

1. Go to `admin.html`
2. Click the "Athletes" tab
3. Fill in athlete information
4. **Important**: Set the school dropdown to your school's slug
5. Click "Add Athlete"

The athlete will appear on the school's page immediately!

## URL Structure

- List all schools: `schools.html`
- View a specific school: `school.html?school=slug-here`
  - Example: `school.html?school=parkersburg`
  - Example: `school.html?school=morgantown`

## File Structure

```
wvruns/
├── school.html          ← Dynamic school page (NEW - use this)
├── schools.html         ← Lists all schools
├── schools/             ← Individual school pages (OLD - can be deleted)
│   ├── parkersburg.html
│   ├── morgantown.html
│   └── ...
└── admin.html           ← Add/edit data
```

## Old vs New System

### Old System (Individual Files)
- ❌ Had to create an HTML file for each school
- ❌ Time-consuming for new schools
- ❌ Easy to miss when adding schools

### New System (Dynamic)
- ✅ One file handles all schools
- ✅ Automatic when adding to Supabase
- ✅ Always up-to-date
- ✅ No manual file creation needed

## Testing

1. Add a test school in the admin page
2. Go to `schools.html` - you should see it listed
3. Click it - you should see the dynamic page loading
4. Add an athlete to that school
5. Refresh - the athlete should appear!


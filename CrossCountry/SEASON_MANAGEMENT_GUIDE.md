# Season Management & Athlete Graduation System

## Overview

This system allows you to manage multiple cross country seasons and automatically track athlete progression through their high school careers. When a new season begins, the site displays current season data by default, while past seasons remain accessible.

## Database Structure

```
crosscountry/
├── seasons/
│   ├── current/          # Current active season
│   │   ├── year: 2025
│   │   ├── startMonth: 8 (August)
│   │   ├── endMonth: 11 (November)
│   │   └── name: "2025 Season"
│   └── archived/
│       ├── 2024/         # Past seasons stored here
│       ├── 2023/
│       └── ...
├── athletes/
│   └── [athlete_slug]/
│       ├── name: "John Smith"
│       ├── grad_year: 2026  # ← KEY: Graduation year
│       ├── school_slug: "morgantown"
│       ├── gender: "M"
│       └── status: "active" | "graduated"
├── meets/
├── results/
└── schools/
```

## Key Concepts

### Graduation Year (`grad_year`)

Each athlete has a `grad_year` field that indicates when they will graduate. This is **critical** for:
- Determining their current class (Freshman, Sophomore, Junior, Senior)
- Identifying seniors for graduation
- Tracking alumni

### Academic Year Calculation

The system uses an academic year that starts in **August (month 7)**:
- **August - July** = One academic year
- If current month ≥ August → academic year = current year + 1
- If current month < August → academic year = current year

**Example:**
- December 2024 → Academic Year 2025
- July 2024 → Academic Year 2024

## How to Use

### 1. Set Up a New Season (August Start)

When the new school year begins in August:

```javascript
// In admin console or Firebase
await setCurrentSeason(2025, 8, 11);  // year, startMonth, endMonth
```

This creates a new current season entry in Firebase.

### 2. Update All Athletes (Grade Advancement)

At the **start of each new season**, advance all active athletes:

```javascript
const result = await advanceAllAthletes();
// Returns: { success: true, advancedCount: 143, athletes: [...] }
```

**What this does:**
- Takes every athlete with `grad_year >= current_academic_year`
- Decreases their `grad_year` by 1 (they get 1 year closer to graduation)
- Records the update timestamp

**Example:** If it's August 2025:
- Freshman with grad_year 2028 → stays 2028 (Freshman next year)
- Sophomore with grad_year 2027 → stays 2027 (Sophomore next year)
- Junior with grad_year 2026 → stays 2026 (Junior next year)
- Senior with grad_year 2025 → stays 2025 (Senior next year - will graduate at end of season)

### 3. Graduate Seniors (May/June)

When seniors graduate (end of school year):

```javascript
const result = await graduateAllSeniors();
// Returns: { success: true, graduatedCount: 37, athletes: [...names...] }
```

**What this does:**
- Finds all athletes with `grad_year === current_academic_year`
- Sets their `grad_year` to previous year (marks them as graduated)
- Sets `status: "graduated"`
- Records graduation timestamp

**After this:**
- Seniors are marked as alumni
- They no longer appear in active athlete lists
- Historical data is preserved for past seasons

### 4. Archive Previous Season

After the season ends and graduates are marked:

```javascript
const success = await archiveSeason(2024);
// Moves 2024 season data to archived/2024
```

### 5. View Past Season Data

Users can view any previous season's stats and records:

```javascript
const seasonData = await getSeasonData(2024);
// Returns: { year, meets, results, athletes, totals }
```

## Athlete Status Determination

The system automatically determines each athlete's status:

```javascript
const status = await getAthleteStatus('john-smith-slug');
```

Returns one of:
- **`active`** - Currently competing
  - `grade: "FR"` | `"SO"` | `"JR"` | `"SR"`
  - `yearsUntilGraduation: 3` (example)
  - `graduatingYear: 2028`

- **`senior`** - Final year before graduation
  - `daysUntilGraduation: 150` (estimated)
  - `graduatingYear: 2025`

- **`graduated`** - Has graduated
  - `yearsAgo: 1` (if graduated last year)
  - `graduatedYear: 2024`

- **`not_found`** - Athlete doesn't exist

## Admin Panel Instructions

### Access Season Management

1. Go to **Admin Dashboard** (`/admin.html`)
2. In the sidebar, find **Season Management** section
3. Choose:
   - **📅 Seasons** - View/manage season records
   - **👥 Athlete Progression** - Track athlete grade advancement

### Manage Athletes

1. Go to **Admin Dashboard**
2. Click **👤 Athletes** in main menu
3. Add/edit athletes with their:
   - Name
   - School
   - Gender
   - **Graduation Year** (2025, 2026, etc.)

### Quick Actions (Coming Soon - Console Only)

For immediate operations, use the browser console on analytics page:

```javascript
// Check how many seniors are graduating
const summary = await getSeasonSummary();
console.log(summary.seniors);  // e.g., 37

// Graduate all seniors
const result = await graduateAllSeniors();
console.log(`Graduated: ${result.graduatedCount} athletes`);

// Advance all active athletes for new season
const advanced = await advanceAllAthletes();
console.log(`Advanced: ${advanced.advancedCount} athletes`);

// View current season
const season = await getCurrentSeason();
console.log(season);  // { year: 2025, startMonth: 8, ... }

// Get specific athlete status
const athlete = await getAthleteStatus('some-slug');
console.log(athlete.grade);  // "JR" | "SR" | etc.
```

## Timeline Example

### August 2024 (Start of School Year)

1. Create athletes with grad_year: 2025 (seniors), 2026, 2027, 2028
2. Set current season: `setCurrentSeason(2024, 8, 11)`
3. Website shows 2024 season data

### September 2024 - November 2024

- Meet results are recorded for 2024 season
- All analytics and rankings show 2024 data
- Historical 2023 season is still viewable (past season)

### June 2025 (End of Year)

1. Run: `graduateAllSeniors()` → 37 seniors graduate
2. Run: `archiveSeason(2024)` → 2024 season moved to archives

### August 2025 (New School Year)

1. Create new freshman athletes with grad_year: 2029
2. Run: `advanceAllAthletes()` → All active athletes advanced
3. Set current season: `setCurrentSeason(2025, 8, 11)`
4. Website now shows 2025 season data by default
5. 2024 season available in "Past Seasons" dropdown

## Database Queries for Common Tasks

### Get All Seniors

```javascript
const db = await getDB();
const snapshot = await db.ref('crosscountry/athletes').once('value');
const athletes = [];
snapshot.forEach(child => athletes.push({id: child.key, ...child.val()}));

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const academicYear = currentMonth >= 7 ? currentYear + 1 : currentYear;

const seniors = athletes.filter(a => a.grad_year === academicYear);
console.log(`Found ${seniors.length} seniors`);
```

### Get Alumni (Graduated Athletes)

```javascript
const alumni = athletes.filter(a => a.status === 'graduated');
console.log(`Alumni count: ${alumni.length}`);
```

### Get Athletes by Grade

```javascript
const academicYear = /* calculated as above */;

const freshmen = athletes.filter(a => a.grad_year === academicYear + 3);
const sophomores = athletes.filter(a => a.grad_year === academicYear + 2);
const juniors = athletes.filter(a => a.grad_year === academicYear + 1);
const seniors = athletes.filter(a => a.grad_year === academicYear);
```

## Important Notes

⚠️ **Before Each Season Starts:**
- ✅ Ensure all athletes have correct `grad_year`
- ✅ Run `advanceAllAthletes()` early August
- ✅ Update current season with `setCurrentSeason()`

⚠️ **At End of Season:**
- ✅ Run `graduateAllSeniors()` in June
- ✅ Archive the season with `archiveSeason()`
- ✅ Add any new freshman athletes

⚠️ **Data Preservation:**
- Past season data is NOT deleted
- Graduated athletes are marked but not removed
- All historical records remain for archival/historical views

## Troubleshooting

### Issue: Athlete appears as "Graduated" but shouldn't be
**Solution:** Check their `grad_year` in database. Should be current academic year + 1, 2, 3, etc. (not past).

### Issue: Athletes not advancing between seasons
**Solution:** Run `advanceAllAthletes()` at start of season. This decreases all active grad_years by 1.

### Issue: Season data showing wrong year
**Solution:** Check `getCurrentSeason()` returns correct year. Update with `setCurrentSeason(year)`.

### Issue: Can't see past season data
**Solution:** Past seasons are archived. You may need to query `getSeasonData(year)` directly for non-current seasons.

## API Reference

See `firebase-helpers.js` for full documentation of:

- `getCurrentSeason()` - Get current active season
- `setCurrentSeason(year, startMonth, endMonth)` - Set current season
- `getArchivedSeasons()` - Get all past seasons
- `archiveSeason(year)` - Archive a season
- `getSeasonData(year)` - Get all data for specific season
- `getAthleteStatus(slug)` - Get athlete's status and grade
- `updateAthleteGradYear(slug, newYear)` - Manually update grad year
- `graduateAllSeniors()` - Bulk graduate all seniors
- `advanceAllAthletes()` - Bulk advance all athletes one grade
- `getSeasonSummary()` - Get current season stats by class


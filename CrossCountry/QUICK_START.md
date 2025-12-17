# Quick Start: Season & Graduation Management

## For Coaches: Simple 3-Step Process

### Step 1: When New School Year Starts (August)

**Go to Admin Dashboard → Season Management → Athlete Progression**

Run in browser console (F12):
```javascript
// Advance all athletes one grade level
const result = await advanceAllAthletes();
alert(`✅ Advanced ${result.advancedCount} athletes to new grades`);
```

Then set new season:
```javascript
await setCurrentSeason(2025, 8, 11);  // Change 2025 to current year
alert('✅ New season set!');
```

### Step 2: Throughout Season (Aug-Nov)

- Import meet results as usual via Results section
- Analytics page automatically shows current season
- Past seasons accessible for historical comparison

### Step 3: When Seniors Graduate (May/June)

Run in console:
```javascript
// Graduate all current seniors
const result = await graduateAllSeniors();
alert(`✅ Graduated ${result.graduatedCount} seniors:\n${result.athletes.join(', ')}`);
```

Then archive past season:
```javascript
await archiveSeason(2024);  // Change to year being archived
alert('✅ Season archived!');
```

---

## For Developers: What Changed

### New Functions Added to `firebase-helpers.js`

**Season Management:**
- `getCurrentSeason()` - Get current active season
- `setCurrentSeason(year, startMonth, endMonth)` - Set current season
- `getArchivedSeasons()` - Get all past seasons
- `archiveSeason(year)` - Archive a season
- `getSeasonData(year)` - Get all data for specific season

**Athlete Graduation:**
- `getAthleteStatus(slug)` - Get athlete status and grade
- `updateAthleteGradYear(slug, newYear)` - Update grad year
- `graduateAllSeniors()` - Graduate all current seniors
- `advanceAllAthletes()` - Advance all athletes one grade
- `getSeasonSummary()` - Get current season stats

### New Admin Sections

**Admin Dashboard** now has:
- 📅 Seasons - Manage season records
- 👥 Athlete Progression - Track athlete advancement

### Database Changes

Added to Firebase:
```
crosscountry/
├── seasons/
│   ├── current/     # Current active season
│   └── archived/    # Past seasons
```

Athletes now have:
- `grad_year` - Graduation year (2025, 2026, etc.)
- `status` - "active" or "graduated"

---

## How It All Works

### The Problem Solved

Before: All data mixed together, hard to distinguish seasons, seniors stayed active forever
After: Clean season separation, automatic graduation tracking, historical data preserved

### The Solution

1. **Season Storage**: Each year's data kept separate
   - Current season is "live"
   - Past seasons archived but accessible
   - Website defaults to current season

2. **Automatic Progression**: One button click advances everyone
   - All athletes get one year closer to graduation
   - Happens once per August
   - No manual updates needed

3. **Graduation Handling**: Seniors marked as alumni
   - No longer appear in active lists
   - Can still view their historical records
   - Clean separation between active/graduated

### Example Timeline

**August 2024:**
- New freshmen added with grad_year: 2028
- Run: `advanceAllAthletes()` (all active athletes go up one year)
- Set current season: 2024

**Sept-Nov 2024:**
- Meet results recorded for 2024
- Website shows 2024 season prominently
- Past 2023 season available if needed

**June 2025:**
- Run: `graduateAllSeniors()` (2025 grads marked as alumni)
- Run: `archiveSeason(2024)`

**August 2025:**
- New freshmen added with grad_year: 2029
- Run: `advanceAllAthletes()` again
- Set current season: 2025
- Website now defaults to 2025 data

---

## Key Database Structure

### Athletes Table

```
Field          | Type   | Example      | Notes
---------------|--------|--------------|------------------
name           | text   | "John Smith" | 
school_slug    | text   | "morgantown" | 
gender         | text   | "M" or "F"   |
grad_year      | number | 2026         | ← IMPORTANT: Graduation year
status         | text   | "active"     | "active" or "graduated"
```

### Seasons Table

```
Field        | Type   | Example          | Notes
-------------|--------|------------------|------------------
year         | number | 2024             | Season year
startMonth   | number | 8                | August = 8
endMonth     | number | 11               | November = 11
name         | text   | "2024 Season"    |
setAt        | date   | 2024-08-01...    | When set
```

---

## Troubleshooting

**Q: Athletes showing wrong grade?**
A: Check `grad_year` in database. Freshman = current year + 3, Sophomore = + 2, Junior = + 1, Senior = current year

**Q: Past season not showing?**
A: Make sure you archived it with `archiveSeason(year)` first

**Q: Need to manually update one athlete's year?**
A: Use: `await updateAthleteGradYear('john-smith-slug', 2026)`

**Q: Current season not set?**
A: Run: `await setCurrentSeason(2025, 8, 11)` in console (change year as needed)

---

## File Locations

- 📄 `firebase-helpers.js` - All season/graduation functions
- 📄 `admin.html` - Management interface (new sections added)
- 📄 `analytics.html` - Analytics already shows current season
- 📄 `SEASON_MANAGEMENT_GUIDE.md` - Full technical documentation


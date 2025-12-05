# Data Migration Guide: Supabase to Firebase

This guide will help you transfer all your data from Supabase to Firebase Realtime Database using CSV exports.

## 📋 Prerequisites

1. **Backup your data** - Make sure you have a backup of your Supabase data before starting
2. **Firebase setup** - Your Firebase project is already configured
3. **Browser** - You'll need a modern browser (Chrome, Firefox, Safari, Edge)

## 🚀 How to Run the Migration

### Step 1: Export Data from Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Table Editor**
4. For each table, click the table name, then:
   - Click the **"..."** menu (three dots) in the top right
   - Select **"Export as CSV"**
   - Save the file with a descriptive name

**Cross Country Tables to Export:**
- `schools` → save as `schools.csv`
- `meets` → save as `meets.csv`
- `athletes` → save as `athletes.csv`
- `results` → save as `results.csv`

**Track Tables to Export:**
- `track_meets` → save as `track_meets.csv`
- `track_events` → save as `track_events.csv`
- `track_athletes` → save as `track_athletes.csv`
- `track_results` → save as `track_results.csv`

### Step 2: Open the Migration Tool

1. Open the file `migrate-from-csv.html` in your web browser
   - You can double-click it, or
   - Right-click → Open With → Your Browser

### Step 3: Upload CSV Files

1. **For Cross Country Data:**
   - Click "Choose File" for each CSV (schools, meets, athletes, results)
   - Select the corresponding CSV file you exported

2. **For Track Data:**
   - Click "Choose File" for each CSV (track_meets, track_events, track_athletes, track_results)
   - Select the corresponding CSV file you exported

### Step 4: Run Migration

- Click **"Migrate Cross Country Data"** to migrate Cross Country files
- Click **"Migrate Track Data"** to migrate Track files
- Or click **"Migrate ALL Uploaded Files"** to migrate everything at once

### Step 3: Monitor Progress

- The tool will show:
  - Progress bars for each table being migrated
  - Real-time statistics
  - Detailed logs of the migration process
  - Success/error messages

### Step 4: Verify the Migration

After migration completes:

1. Check the statistics shown in the tool
2. Test your application to ensure data appears correctly
3. Verify in Firebase Console:
   - Go to https://console.firebase.google.com
   - Select your project: `mountainstatemiles-1326f`
   - Navigate to Realtime Database
   - Check that your data is there

## ⚠️ Important Notes

### Data Structure

- **UUIDs are removed**: Supabase uses UUIDs for IDs, but Firebase generates its own keys. The migration tool removes the UUID `id` field and lets Firebase generate new keys.

### Date Fields

- Date fields are converted to strings for Firebase compatibility
- The format is preserved from Supabase

### Relationships

- Foreign key relationships (like `school_slug`, `meet_slug`) are preserved as-is
- Firebase doesn't enforce foreign keys, but the data structure is maintained

### Track Data

- Track data comes from a different Supabase instance
- The tool automatically uses the correct Supabase connection for each data type

## 🔧 Troubleshooting

### "Table does not exist" Error

- This is normal if you haven't created that table in Supabase yet
- The migration will skip missing tables and continue

### Migration is Slow

- Large datasets may take several minutes
- The progress bar will show you the current status
- Don't close the browser tab during migration

### Some Data Missing

- Check the logs for any error messages
- Verify that the data exists in Supabase first
- Make sure you have the correct Supabase credentials

## 🗑️ Clearing Firebase (Optional)

If you need to start over:

1. Click the "⚠️ Clear Firebase" button
2. Confirm the action (this cannot be undone!)
3. Run the migration again

**Warning**: This will delete ALL data in Firebase!

## ✅ After Migration

Once migration is complete:

1. ✅ Test your application
2. ✅ Verify data appears correctly
3. ✅ Check that all features work
4. ✅ Consider keeping Supabase as backup for a while

## 📊 Migration Statistics

The tool shows real-time statistics:
- Number of records migrated per table
- Progress percentage
- Success/error counts

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console (F12) for detailed error messages
2. Verify your Supabase credentials are correct
3. Make sure Firebase Realtime Database is enabled in your Firebase project
4. Check Firebase Security Rules allow writes

---

**Good luck with your migration!** 🎉


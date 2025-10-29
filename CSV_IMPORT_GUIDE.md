# CSV Import Guide for WV Runs

This guide explains how to import meet results using CSV files.

## Overview

The CSV import feature allows you to quickly upload meet results for multiple athletes at once. This is much faster than entering results one by one through the admin panel.

## How to Use

1. **Access the CSV Import Tool**
   - Go to the Admin panel (`admin.html`)
   - Click on the "CSV Import" tab

2. **Fill in Meet Information**
   - **Meet Name**: The official name of the meet (e.g., "State Championship")
   - **Meet Slug**: A unique identifier for the meet (e.g., "state-championship-2025")
     - If a meet with this slug already exists, results will be added to that meet
     - If it's a new slug, a new meet will be created
     - Click "Check existing meets" to see what slugs are already used
   - **Date**: The date the meet took place
   - **Location**: Where the meet was held (optional)
   - **Description**: Additional details about the meet (optional)

3. **Prepare Your CSV File**
   - Download the CSV template by clicking "Download CSV template"
   - Fill in your results data following the template format
   - Save as a `.csv` file

4. **Upload and Import**
   - Select your CSV file using the file input
   - Click "Import Results"
   - Review the import summary for any errors

## CSV Format

Your CSV file must have the following columns (in this exact order):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `athlete_name` | Yes | Full name of the athlete | "John Smith" |
| `school_slug` | No | School identifier | "morgantown" |
| `gender` | No | M or F | "M" or "F" |
| `time` | No | Time in MM:SS.ss format | "18:30.45" (18 min 30.45 sec) |
| `distance` | No | Distance in meters | "5000" |
| `place` | No | Finishing place | "1" |

### Important Notes

- **Time Format**: Enter times in MM:SS.ss format (e.g., "18:30.45" for 18 minutes and 30.45 seconds)
- **School Slugs**: Use the exact school identifiers from your database (e.g., "morgantown", "university-high", "bridgeport")
- **Gender**: Use "M" for male, "F" for female
- **Empty Fields**: Leave fields empty if you don't have the data

## Sample CSV

```csv
athlete_name,school_slug,gender,time,distance,place
John Smith,morgantown,M,18:30.45,5000,1
Jane Doe,university-high,F,20:15.20,5000,2
Mike Johnson,bridgeport,M,19:45.10,5000,3
```

## Error Handling

The system will validate your data and show you:
- How many rows were successfully imported
- Any errors that occurred during import
- Specific row numbers where errors were found

Common errors include:
- Missing required fields (athlete_name is required)
- Invalid time format (must be a number)
- Invalid gender values (must be M or F)
- Invalid school slugs (must match existing schools)

## Viewing Results

After importing, you can view the meet results by:
1. Going to the Meets page (`meets.html`)
2. Clicking on the meet you just created
3. This will take you to the individual meet page showing all results

## Adding Results to Existing Meets

If you want to add more results to a meet that already exists:

1. **Use the Existing Meet Slug**: Enter the exact slug of the existing meet
2. **Check Existing Meets**: Click "Check existing meets" to see all current meet slugs
3. **Import Results**: The system will automatically add results to the existing meet
4. **Meet Information**: The meet name, date, location, and description fields are ignored when adding to existing meets

## Tips

- **Test with Small Files**: Start with a few rows to test the format
- **Check School Slugs**: Make sure all school slugs match existing schools in your database
- **Time Conversion**: Use MM:SS.ss format (e.g., 18:30.45 for 18 minutes 30.45 seconds)
- **Backup Data**: Always keep a backup of your original CSV files
- **Existing Meets**: Use "Check existing meets" to avoid creating duplicate meets

## Troubleshooting

If you encounter issues:

1. **Check the Import Status**: Look at the error messages in the import status section
2. **Verify CSV Format**: Make sure your CSV matches the template exactly
3. **Check School Data**: Ensure all school slugs exist in your schools table
4. **Test Database**: Run `test-current-schema.sql` to verify your database is ready
5. **Browser Console**: Check the browser console for detailed error messages

### Common Issues:

- **"Invalid time value"**: Check that times are in MM:SS.ss format (e.g., "18:30.45")
- **"Time value too large"**: Ensure times are reasonable (under 2 hours for most races)
- **"Missing required fields"**: Make sure athlete_name is filled in for all rows
- **"School not found"**: Verify school slugs match existing schools in your database

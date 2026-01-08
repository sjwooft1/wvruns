# News & Recap System Guide

Welcome to the automated news and meet recap system for Mountain State Miles!

## Overview

This system consists of three main components:

1. **News Page** (`/news.html`) - Public-facing page displaying all recaps and articles
2. **Admin Panel** (`/news-admin.html`) - Tool for creating, managing, and auto-generating articles
3. **Analytics Engine** (`news-analytics.js`) - Automatically analyzes meet results and generates insights

## Quick Start

### For Visitors
- Visit `/news.html` to read all latest recaps
- News also appears on the home page (`/home/index.html`) showing recent articles

### For Admins
- Go to `/news-admin.html` to manage news
- Three tabs: Create Article, Auto-Generate Summary, Manage Articles

---

## Creating Articles Manually

1. **Go to News Admin** → Click "Create Article" tab
2. **Fill in the form:**
   - **Title**: Give your article a catchy name (e.g., "Morgantown Invitational — Upset Victory")
   - **Sport**: Select "Track & Field" or "Cross Country"
   - **Date**: When the meet occurred
   - **Meet Name** (optional): Name of the meet
   - **Type**: Mark as "Manual" for articles you write
   - **Summary**: Your main article text (this supports line breaks)
   - **Highlights**: Key points (one per line, e.g., "🏆 Johnson breaks school record")
   - **Standout Athletes**: Add athletes with their teams (click "+ Add Athlete")

3. **Click "Publish Article"** and your piece goes live immediately!

---

## Auto-Generating Meet Summaries

This is the cool part! The system can automatically analyze meet results and generate summaries.

### How It Works

1. **Go to News Admin** → Click "Auto-Generate Summary" tab
2. **Select:**
   - Sport (Track & Field or Cross Country)
   - The specific meet from the dropdown
3. **Click "Generate Summary"**

The system will:
- Analyze all results from that meet
- Identify top performers
- Calculate team performance/scores
- Generate key highlights automatically
- Show you a preview before publishing

### What Gets Analyzed

✅ **Top Performers** - Athletes with best performances (times, distances, etc.)
✅ **Team Performance** - How teams did overall and scoring
✅ **Highlights** - Automatically extracted key moments
✅ **Personal Records** - When athletes exceed expectations
✅ **Statistical Trends** - Patterns in the data

### Example Output

```
Title: "Morgantown XC Invitational — Meet Recap"
Summary: "The Morgantown XC Invitational took place on September 15th at the 
Morgantown Golf Club. Led by standout performances, the meet drew 12 teams 
with 85 total athletes. University High School took the team title with a 
strong showing across all divisions..."

Key Highlights:
🏆 Sarah Johnson (University High) earned first place with 18:32
🥈 Emma Davis (Morgantown) finished strong in second with 18:47
🏫 12 teams participated
```

---

## Understanding the Firebase Structure

The system stores data in these locations:

```
firebase
├── news/                          # All articles and recaps
│   ├── {id}
│   │   ├── title: string
│   │   ├── date: YYYY-MM-DD
│   │   ├── sport: "Track" | "Cross Country"
│   │   ├── summary: string
│   │   ├── highlights: array
│   │   ├── standoutAthletes: array
│   │   ├── type: "Manual" | "Auto-Generated"
│   │   └── createdAt: ISO timestamp
│
├── Track/
│   ├── meets/                     # Meet information
│   ├── results/{meetId}/          # Results to analyze
│   └── athleteHistory/            # For comparing performance
│
└── CrossCountry/
    ├── meets/                     # Meet information
    ├── results/{meetId}/          # Results to analyze
    └── athleteHistory/            # For comparing performance
```

---

## Adding Results for Auto-Generation

For the auto-generation to work, you need to have meet results uploaded to Firebase.

### Required Result Format

Results should be stored at: `Track/results/{meetId}/` or `CrossCountry/results/{meetId}/`

Each result should have:
```javascript
{
  "athleteId": {
    "name": "John Smith",
    "team": "Morgantown High",
    "time": "18:32",        // For XC or running events
    "event": "1600m",       // For track
    "place": 1,
    "distance": "5K"        // For XC
  }
}
```

---

## Tips & Best Practices

### For Manual Articles
- ✍️ Use emojis to make highlights more engaging
- 🏫 Always mention team names and notable achievements
- 📊 Include statistics where relevant
- 🎯 Link related meets in your text

### For Auto-Generated Summaries
- ⚡ Review the preview before publishing
- 📝 Edit if you want to add more context
- 🔄 Can regenerate multiple times if results change
- ✅ Check that athlete names are spelled correctly in results

### Timing
- Publish recaps within 24 hours of a meet for best engagement
- Use auto-generation immediately after uploading results
- Manual articles are great for in-depth analysis or upcoming season previews

---

## Troubleshooting

### "No meets found" error
- Make sure the sport is selected
- Verify meets exist in the Track/meets or CrossCountry/meets section

### "No results found for this meet" error
- Results haven't been uploaded to Firebase yet
- Check that results are in the correct path: `{Sport}/results/{meetId}/`

### Preview looks incomplete
- Some athletes might be missing data (names, teams)
- Edit the preview or wait for complete results before publishing

### Articles not showing on home page
- Home page shows only the 6 most recent
- Visit `/news.html` to see all articles
- Check browser cache if old articles still show

---

## Integration with Existing Pages

The news system automatically integrates with:
- **Home Page** - Recent recaps appear in a featured section
- **Meet Pages** - Could be linked from individual meet pages
- **Admin Hub** - Accessible from `/home/admin.html`

---

## Advanced Features

### Analytics Engine Capabilities

The `MeetAnalytics` class can be extended to:
- Compare current performances to athlete historical averages
- Predict team scores before meets
- Identify unexpected breakout performances
- Generate performance trends over a season

### Custom Summaries

To create a custom summary generator:
```javascript
const analytics = new MeetAnalytics(database);
const summary = await analytics.generateMeetSummary('track', 'meet-slug');
```

---

## Future Enhancements

Potential additions:
- 📧 Email notifications for new recaps
- 🔔 Push notifications for record-breaking performances
- 📊 Advanced analytics and visualizations
- 🎥 Video highlight integration
- 📱 Mobile app integration
- 🏆 Season recap generation
- 🤖 AI-powered summary writing

---

## Support

For issues or questions:
1. Check this guide first
2. Review the Firebase data structure
3. Test with sample data if auto-generation isn't working
4. Contact the admin team

Happy recap writing! 🎉

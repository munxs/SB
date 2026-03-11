# Installation Guide

This guide walks you through applying the Streamberry theme to your Jellyfin server.

---

## Prerequisites

- Access to your Jellyfin **admin dashboard**
- Jellyfin 10.8 or newer (recommended)

---

## Step 1 — Apply the CSS

1. Log into Jellyfin as an administrator
2. Navigate to **Dashboard → General**
3. Scroll down to the **Custom CSS** section
4. Open `src/css/Streamberry.css` from this repo
5. Copy the **entire contents** and paste it into the Custom CSS field
6. Click **Save**

---

## Step 2 — Apply the JavaScript

1. In the same **Dashboard → General** page
2. Scroll to the **Custom JavaScript** section
3. Open `src/js/Streamberry.js` from this repo
4. Copy the **entire contents** and paste it into the Custom JavaScript field
5. Click **Save**

---

## Step 3 — Reload Jellyfin

- Hard refresh your browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or log out and log back in

The theme should now be active.

---

## Bottom Navigation Bar

The JS file adds a custom bottom nav bar with the following items:

| Tab | Icon | Destination |
|---|---|---|
| Home | 🏠 | Jellyfin home |
| Movies | 🎬 | Movies library |
| TV | 📺 | TV Shows library |
| Search | 🔍 | Search page |
| My Vault | ⋯ | Side panel (Profile, Favorites, Settings, Sign Out) |

---

## Updating

When you update either file:

1. Return to **Dashboard → General**
2. Clear the relevant field
3. Paste in the new file contents
4. Save and hard refresh

---

## Troubleshooting

**Theme not appearing?**
- Make sure you saved after pasting
- Try a hard refresh (`Ctrl + Shift + R`)
- Check browser console for errors (`F12 → Console`)

**Bottom nav not showing?**
- Confirm the JS was pasted correctly with no truncation
- Some ad blockers or browser extensions can interfere — try disabling them

**Fonts not loading?**
- The theme uses Google Fonts (Inter). Ensure your browser/network can reach `fonts.googleapis.com`

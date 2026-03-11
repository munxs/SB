# Installation Guide

This guide walks you through applying the Streamberry theme to your Jellyfin server via jsDelivr CDN.

---

## Prerequisites

- Access to your Jellyfin **admin dashboard**
- Jellyfin 10.8 or newer (recommended)
- A modern browser (Chrome, Firefox, Edge, Safari)

---

## Step 1 — Apply the CSS

1. Log into Jellyfin as an administrator
2. Navigate to **Dashboard → General**
3. Scroll down to the **Custom CSS** section
4. Paste the following:

```css
@import url("https://cdn.jsdelivr.net/gh/munxs/streamberry@main/src/css/Streamberry.css");
```

5. Click **Save**

---

## Step 2 — Apply the JavaScript

1. On the same **Dashboard → General** page
2. Scroll to the **Custom JavaScript** section
3. Paste the following:

```js
var s = document.createElement('script');
s.src = "https://cdn.jsdelivr.net/gh/munxs/streamberry@main/src/js/Streamberry.js";
document.head.appendChild(s);
```

4. Click **Save**

---

## Step 3 — Reload Jellyfin

Hard refresh your browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)

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

## Updating the Theme

When you push changes to the `main` branch on GitHub, jsDelivr CDN may cache the old version for up to 24 hours. To force an immediate update:

1. Go to [jsdelivr.com/tools/purge](https://www.jsdelivr.com/tools/purge)
2. Paste these URLs and click **Purge**:
   - `https://cdn.jsdelivr.net/gh/munxs/streamberry@main/src/css/Streamberry.css`
   - `https://cdn.jsdelivr.net/gh/munxs/streamberry@main/src/js/Streamberry.js`
3. Hard refresh Jellyfin (`Ctrl + Shift + R`)

---

## Troubleshooting

**Theme not appearing?**
- Make sure you saved after pasting in the Dashboard
- Try a hard refresh (`Ctrl + Shift + R`)
- Check browser console for errors (`F12 → Console`)
- Confirm the repo is set to **public** on GitHub

**Bottom nav not showing?**
- Confirm the JS snippet was pasted correctly
- Some ad blockers or browser extensions can interfere — try disabling them

**Fonts not loading?**
- The theme uses Google Fonts (Inter). Ensure your browser/network can reach `fonts.googleapis.com`

**CDN serving old version?**
- Purge the jsDelivr cache using the steps in the **Updating** section above

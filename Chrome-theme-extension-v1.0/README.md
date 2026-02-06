# Real Simple Theme Generator

A lightweight Chrome extension that generates a valid `manifest.json` file for creating custom Chrome themes.

This tool focuses on simplicity and transparency: it **creates and downloads a theme manifest file**, but does **not automatically apply themes**, due to Chrome security restrictions.

---

## What This Extension Does

- Lets users choose Chrome theme colors through a popup UI
- Displays **live color preview bars** that update as colors are selected
- Automatically adjusts preview text color for readability
- **Automatically adapts the popup UI to light or dark mode** based on the user’s system/Chrome theme
- Uses **Segoe UI Variable Display Semibold** (with graceful fallbacks) for a clean, native UI appearance
- Generates a valid Chrome theme `manifest.json`
- **Reliably downloads the manifest using the Chrome Downloads API**

## What This Extension Does *Not* Do

- It does **not** automatically change or apply your Chrome theme
- It does **not** upload data or communicate with external services

---

## How to Use the Generated Theme

1. Use the popup to select your desired theme colors.
2. Click **Download Theme Manifest**.
3. Choose where to save the downloaded `manifest.json`.
4. Create a new empty folder on your computer and place the file inside it.
5. Open `chrome://extensions` in Chrome.
6. Enable **Developer mode** (top-right toggle).
7. Click **Load unpacked** and select the folder.

Chrome themes must be loaded manually due to browser security restrictions.

---

## Technical Notes

- The extension uses the **Chrome Downloads API** instead of a temporary link click to ensure reliable file downloads from extension popups.
- The popup UI uses the browser’s native `prefers-color-scheme` media query for automatic light/dark mode.

---

## Project Files

- `manifest.json` – Chrome extension configuration (MV3)
- `popup.html` – User interface (auto light/dark mode)
- `popup.js` – Theme manifest generation + reliable download logic
- `icon128.png` – Extension icon
- `README.md` – Project documentation
- `AI_ATTRIBUTION.md` – AI usage disclosure

---

## Permissions

- `downloads`: Required to save the generated `manifest.json` file locally

No user data is collected, stored, or transmitted.

---

## Known Limitations

- Chrome extensions cannot apply themes programmatically
- Users must manually load the generated theme using **Load unpacked**
- Theme changes only take effect after loading the theme as an unpacked extension

# Real Simple Theme Generator

A lightweight Chrome extension that generates a valid `manifest.json` file for creating custom Chrome themes.

This tool focuses on simplicity and transparency: it **creates a theme manifest file**, but does **not automatically apply themes**, due to Chrome security restrictions.

---

## What This Extension Does

- Lets users choose theme colors using a simple popup UI
- Displays **live color preview bars** that update as colors are selected
- Automatically adjusts preview text color for readability
- **Automatically adapts the popup UI to light or dark mode** based on the user’s system/Chrome theme
- Uses **Segoe UI Variable Display Semibold** (with graceful fallbacks) for a clean, native UI appearance
- Generates a valid Chrome theme `manifest.json`
- Downloads the file locally to the user's computer

## What This Extension Does *Not* Do

- It does **not** automatically change or apply your Chrome theme
- It does **not** upload data or communicate with external services

---

## How to Use the Generated Theme

1. Create a new empty folder on your computer
2. Move the downloaded `manifest.json` into that folder
3. Open `chrome://extensions` in Chrome
4. Enable **Developer Mode** (toggle in the top-right corner)
5. Click **Load unpacked** and select the folder

Chrome themes must be loaded manually due to browser security restrictions.

---

## Project Files

- `manifest.json` – Chrome extension configuration
- `popup.html` – User interface with automatic light/dark mode and system-native typography
- `popup.js` – Logic for live color previews and theme manifest generation
- `icon128.png` – Extension icon
- `README.md` – Project documentation
- `AI_ATTRIBUTION.md` – AI usage disclosure

---

## Permissions

- `downloads`: Required to save the generated `manifest.json` file locally

No user data is collected, stored, or transmitted.

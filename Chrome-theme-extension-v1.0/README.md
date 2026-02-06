# Real Simple Theme Generator

A lightweight Chrome extension that generates a valid `manifest.json` file for creating custom Chrome themes.

This tool focuses on simplicity and transparency: it **creates a theme manifest file**, but does **not automatically apply themes**, due to Chrome security restrictions.

---

## What This Extension Does

- Lets users choose theme colors using a simple popup UI
- Generates a valid Chrome theme `manifest.json`
- Downloads the file locally to the user's computera

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
- `popup.html` – User interface for selecting theme options
- `popup.js` – Logic for generating and downloading the theme manifest
- `icon128.png` – Extension icon

---

## Permissions

- `downloads`: Required to save the generated `manifest.json` file locally

No user data is collected, stored, or transmitted.

---

## Known Limitations

- Chrome extensions cannot apply themes programmatically
- Users must manually load the generated theme using **Load unpacked**
- No live theme preview is provided
- Customization is intentionally minimal to keep the tool easy to use

---

## Design Rationale

This project prioritizes clarity, safety, and adherence to Chrome extension policies. The manual workflow is a deliberate design tradeoff that avoids overreaching permissions while still giving users full control over their themes.

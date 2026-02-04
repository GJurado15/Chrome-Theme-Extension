# cs3250_group4 - Theme Saver Extension

## Team Members
- Jack Mahoney
- Dustin Jones
- Moriah Lane

## Project Overview
A Chrome/Chromium browser extension that allows users to save and organize color themes.

## Project Structure
```
cs3250_group4/
├── manifest.json      # Extension metadata and configuration
├── popup.html         # Extension popup UI
├── popup.js           # Popup functionality and storage logic
├── styles.css         # Popup styling
├── icons/             # Extension icons (16x16, 48x48, 128x128)
│   └── README.md      # Icon setup instructions
├── AI_ATTRIBUTION.md  # AI-generated code documentation
└── README.md          # This file
```

## Setup Instructions

### 1. Add Icons (Optional)
Create or add PNG icon files to the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

See `icons/README.md` for quick placeholder generation.

### 2. Load Extension into Chrome/Chromium
1. Open Chrome/Chromium browser
2. Navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select this project folder (`cs3250_group4/`)
6. Extension should appear in your toolbar

### 3. Development Workflow
- **After editing popup files** (popup.html, popup.js, styles.css): Close and reopen the popup
- **After editing manifest.json**: Click the reload button (🔄) on the extension card at `chrome://extensions`
- **Debugging**: Right-click extension icon → "Inspect popup" to open DevTools

## Features
- Save themes with custom names and colors
- View all saved themes
- Delete individual themes
- Persistent storage using Chrome Storage API

## Resources
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)

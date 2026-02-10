# cs3250_group4 - Chrome Theme Generator Extension

## Team Members
- Jack Mahoney
- Dustin Jones
- Moriah Lane

## Project Overview
A Chrome/Chromium browser extension that allows users to create, preview, and download custom browser themes with solid colors, gradients, or image backgrounds.

## Project Structure
```
The-Real-Group-0100/
├── Chrome-theme-extension-v1.3/
│   ├── manifest.json      # Extension metadata and configuration (v2.0)
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup functionality and theme generation logic
│   ├── jszip.min.js       # JSZip library for ZIP file creation
│   └── icons/
│       └── icon128.png    # Extension icon
├── background-options-examples/
│   ├── customizable-gradient-background.png
│   └── upload-background-image.png
├── AI_ATTRIBUTION.md      # AI-generated code documentation
└── README.md              # This file
```

## Setup Instructions

### 1. Load Extension into Chrome/Chromium
1. Open Chrome/Chromium browser
2. Navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `Chrome-theme-extension-v1.3/` folder
6. The extension should appear in your toolbar

### 2. Development Workflow
- **After editing popup files** (popup.html, popup.js): Close and reopen the popup
- **After editing manifest.json**: Click the reload button on the extension card at `chrome://extensions`
- **Debugging**: Right-click extension icon → "Inspect popup" to open DevTools

## Features

### Theme Creation
- **Solid color** backgrounds with a color picker
- **Gradient backgrounds** with 2-6 color stops, 5 direction options (top-to-bottom, left-to-right, two diagonals, radial)
- **Image upload** for custom background images
- **Frame color** customization (browser chrome)
- **Toolbar color** customization (URL bar area)
- **Active/inactive tab colors** for tab styling
- **Text color** selection for tab text, bookmark text, and new tab page text

### Live Preview
- Real-time browser mockup at the top of the popup updates instantly as you adjust any color or setting

### Preset Themes
- 5 built-in presets: Dark Mode, Ocean Breeze, Sunset Glow, Forest, Monochrome
- One-click loading to quickly start from a base theme and customize further

### Theme History
- Automatically saves your last 10 created themes using Chrome's storage API
- Load or delete saved themes from the collapsible "Saved Themes" section

### Export / Import
- **Export** your current theme configuration as a shareable JSON file
- **Import** a JSON config to load someone else's theme settings

### Additional
- Toast notifications for success, error, and info feedback
- Input validation (e.g., checks for missing image before download)
- Reset button to restore all defaults
- ARIA labels and keyboard navigation for accessibility

## How to Use a Generated Theme

1. Click **Download Theme** in the extension popup
2. Create a new folder on your PC
3. Move the downloaded file (`.zip` or `.json`) into it
4. If it's a ZIP, unzip it inside that folder
5. Go to `chrome://extensions`
6. Click **Load Unpacked** and select that folder
7. Chrome will apply your custom theme

## Resources
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Theme Reference](https://developer.chrome.com/docs/extensions/mv3/themes/)

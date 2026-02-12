# cs3250_group4 – Chrome Theme Generator Extension

## Team Members
- Jack Mahoney  
- Dustin Jones  
- Guillermo Jurado
- Moriah Lane  
- Jorge Medrano  

---

## Project Overview

A Chrome/Chromium browser extension that allows users to create, preview, and download custom browser themes using solid colors, gradients, or image backgrounds.

This project includes an ESLint (v10+ flat configuration) setup to maintain consistent JavaScript standards and improve long-term maintainability.

---

## Repository Structure

The-Real-Group-0100/
├── Chrome-theme-extension-v1.3/
│ ├── manifest.json # Extension metadata and configuration (MV3)
│ ├── popup.html # Extension popup UI
│ ├── popup.js # Popup functionality and theme generation logic
│ ├── jszip.min.js # JSZip vendor library (excluded from linting)
│ ├── eslint.config.mjs # ESLint flat configuration
│ ├── package.json # Dev tooling configuration
│ └── icons/
│ └── icon128.png # Extension icon
├── background-options-examples/
│ ├── customizable-gradient-background.png
│ └── upload-background-image.png
├── AI_ATTRIBUTION.md # AI-generated code documentation
└── README.md # This file
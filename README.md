# cs3250_group4 - Chrome Theme Generator Extension

## Team Members
- Jack Mahoney
- Dustin Jones
- Guillermo Jurado
- Moriah Lane
- Jorge Medrano

## Project Overview

This repository contains a Chrome extension that lets a user create a custom Chrome theme, preview it, and export the generated `manifest.json` and optional `background.png` directly into a folder for loading as an unpacked extension.

## User Guide

1. Open the extension from the Chrome toolbar.
2. Choose a preset or customize the theme name, colors, and background.
3. If using an image background, pick an image file under 20 MB.
4. Click `Download Theme`.
5. When prompted, choose an empty folder or a folder you want to use for the generated theme files.
6. Chrome opens `chrome://extensions` automatically.
7. Enable `Developer mode`, click `Load unpacked`, and select the folder you chose.

The extension writes:
- `manifest.json`
- `background.png` when the background type is `gradient` or `image`

## Development Tooling

This project uses ESLint, Jest, and JSDoc to support quality checks and documentation.

## Prerequisites

- Node.js 18 or newer
- npm

Install dependencies from the extension directory:

```powershell
cd Chrome-theme-extension-v1.3
npm install
```

## Scripts

Run lint:

```powershell
npm run lint
```

Run tests:

```powershell
npm test
```

Run tests with coverage:

```powershell
npm run test:coverage
```

Generate JSDoc output:

```powershell
npm run docs
```

The generated documentation is written to `Chrome-theme-extension-v1.3/docs/index.html`.

## Notes

- ESLint is configured in `Chrome-theme-extension-v1.3/eslint.config.mjs`.
- JSDoc is configured in `Chrome-theme-extension-v1.3/jsdoc.json`.
- Generated `docs/`, `coverage/`, and `node_modules/` are ignored by git.

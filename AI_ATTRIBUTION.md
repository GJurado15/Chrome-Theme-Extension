# AI-Generated Code Attribution

---

## ESLint Setup
**AI Tool**: ChatGPT (OpenAI) – GPT-5.2 | **Date**: February 11, 2026

**Prompts**:
- "Integrate ESLint into this Chrome extension project."
- "Configure ESLint 10 flat config for a browser-based extension."
- "Resolve linting issues caused by vendor/minified files."
- "Adapt lint rules to be appropriate for a Chrome MV3 environment."

**Files**: `eslint.config.mjs`, `package.json`, `README.md`

---

## Jest Testing
**AI Tool**: ChatGPT (OpenAI) – GPT-5.2 | **Date**: February 12, 2026

**Prompts**:
- "Set up Jest unit testing for this Chrome extension project."
- "Refactor the code so core logic can be tested without Chrome APIs or the DOM."
- "Create a reusable utilities module and write Jest tests for it."
- "Fix failing Jest tests and align expected outputs with updated utility behavior."

**Files**: `themeUtils.js`, `themeUtils.test.js`, `package.json`

---

## JSDoc Documentation
**AI Tool**: ChatGPT (OpenAI) – GPT-5.2 | **Date**: February 16, 2026

**Prompts**:
- "Add JSDoc documentation to this Chrome theme extension."
- "Create typedef models for configuration objects."
- "Generate proper @param and @returns annotations."

**Files**: `popup.js`, `themeUtils.js`

---

## Bug Fixes, Refactoring & Feature Work
**AI Tool**: Claude Code (Anthropic) – Claude Sonnet 4.6 | **Date**: March 12, 2026

**Prompts**:
- "Look over this entire project and check for any errors."
- "Fix all of these issues."
- Various bug fixes, UX improvements, and feature changes throughout the session.

**Files Modified**: `popup.js`, `popup.html`, `manifest.json`, `background.js`, `package.json`

**Changes**:
- Consolidated global state into a `state` object
- Fixed preset loading bug (frame/toolbar colors not applying)
- Fixed race condition in history delete handler
- Removed 246 transitive packages from `dependencies`
- Fixed Chromium popup crash on Linux by using `chrome.windows.create({ type: 'popup' })`
- Replaced zip download with File System Access API (no manual unzipping)
- Auto-opens `chrome://extensions` after download
- Converted image uploads to PNG via canvas for format compatibility
- Various UI cleanup and error handling improvements

---

*All final decisions, integration, and validation were performed by the project authors. The authors retain full responsibility for the correctness and integrity of the submitted work.*
